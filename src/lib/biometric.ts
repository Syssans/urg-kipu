import { registerPlugin } from "@capacitor/core";
import { useEffect, useState } from "react";
import { isNative } from "./native";
import { fromBase64, toBase64 } from "./vault";

// Face ID / Touch ID unlock for the patient sheets, in the iOS app only. The sheets' key is
// kept in the iOS Keychain by the native KipuBiometric plugin (KipuViewController.swift),
// which hands it back only after a successful biometric check. Only a "Face ID is on" flag
// is kept here.

interface KipuBiometricPlugin {
  isAvailable(): Promise<{ available: boolean; type: "faceID" | "touchID" | "none" }>;
  saveKey(options: { key: string }): Promise<void>;
  loadKey(options: { reason: string }): Promise<{ key: string }>;
  deleteKey(): Promise<void>;
}

const Biometric = registerPlugin<KipuBiometricPlugin>("KipuBiometric");
const FLAG_KEY = "kipu:biometric";

export interface BiometricInfo {
  available: boolean;
  // "Face ID" or "Touch ID"
  label: string;
}

let info: Promise<BiometricInfo> | null = null;

export function biometricInfo(): Promise<BiometricInfo> {
  info ??= (async () => {
    if (!isNative) return { available: false, label: "" };
    try {
      const { available, type } = await Biometric.isAvailable();
      return { available, label: type === "touchID" ? "Touch ID" : "Face ID" };
    } catch {
      return { available: false, label: "" };
    }
  })();
  return info;
}

export function biometricEnabled() {
  try {
    return localStorage.getItem(FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export async function saveBiometricKey(key: Uint8Array) {
  await Biometric.saveKey({ key: toBase64(key) });
  try {
    localStorage.setItem(FLAG_KEY, "1");
  } catch {
    // flag lost: Face ID simply won't be offered
  }
}

export async function forgetBiometricKey() {
  try {
    localStorage.removeItem(FLAG_KEY);
  } catch {
    // nothing stored
  }
  if (!isNative) return;
  try {
    await Biometric.deleteKey();
  } catch {
    // nothing to delete
  }
}

export type BiometricResult = { key: Uint8Array } | { error: "cancelled" | "invalid" | "failed" };

export async function loadBiometricKey(reason: string): Promise<BiometricResult> {
  try {
    const { key } = await Biometric.loadKey({ reason });
    return { key: fromBase64(key) };
  } catch (e) {
    const code = (e as { code?: string })?.code;
    return { error: code === "cancelled" || code === "invalid" ? code : "failed" };
  }
}

/** Whether this device offers Face ID / Touch ID to Kipu (always unavailable on the web). */
export function useBiometricInfo(): BiometricInfo {
  const [value, setValue] = useState<BiometricInfo>({ available: false, label: "" });
  useEffect(() => {
    let alive = true;
    biometricInfo().then((v) => alive && setValue(v));
    return () => {
      alive = false;
    };
  }, []);
  return value;
}
