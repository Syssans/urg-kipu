import { gcm } from "@noble/ciphers/aes.js";
import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";

// Encryption of the patient sheets: AES-256-GCM with a key derived from the user's code
// (PBKDF2-SHA256). Pure JavaScript (@noble), so it also works in the iOS app's web view,
// where the browser's own crypto.subtle may be missing; crypto.subtle only speeds up the
// key derivation when it is there.

export const KDF_ITERATIONS = 600_000;

export interface Sealed {
  iv: string;
  data: string;
}

export const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(n));

export function toBase64(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

export function fromBase64(text: string) {
  const s = atob(text);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes;
}

// Some web views expose crypto.subtle but never settle its promises: give it a deadline.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

let subtleWorks: Promise<boolean> | null = null;
function checkSubtle(): Promise<boolean> {
  subtleWorks ??= (async () => {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return false;
    try {
      const base = await withTimeout(subtle.importKey("raw", new Uint8Array([1]), "PBKDF2", false, ["deriveBits"]), 1000);
      await withTimeout(subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: new Uint8Array(16), iterations: 1 }, base, 256), 1000);
      return true;
    } catch {
      return false;
    }
  })();
  return subtleWorks;
}

export async function deriveKey(code: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const password = new TextEncoder().encode(code);
  if (await checkSubtle()) {
    try {
      const subtle = crypto.subtle;
      const base = await subtle.importKey("raw", password, "PBKDF2", false, ["deriveBits"]);
      const bits = await withTimeout(subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: new Uint8Array(salt), iterations }, base, 256), 15000);
      return new Uint8Array(bits);
    } catch {
      // fall through to the JavaScript implementation
    }
  }
  return pbkdf2Async(sha256, password, salt, { c: iterations, dkLen: 32, asyncTick: 20 });
}

export function seal(key: Uint8Array, text: string): Sealed {
  const iv = randomBytes(12);
  const data = gcm(key, iv).encrypt(new TextEncoder().encode(text));
  return { iv: toBase64(iv), data: toBase64(data) };
}

/** Throws when the key is wrong or the data was altered. */
export function open(key: Uint8Array, sealed: Sealed): string {
  const plain = gcm(key, fromBase64(sealed.iv)).decrypt(fromBase64(sealed.data));
  return new TextDecoder().decode(plain);
}
