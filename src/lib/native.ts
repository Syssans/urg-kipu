import { Capacitor, registerPlugin, type PluginListenerHandle } from "@capacitor/core";

// Bridge to the native iOS nav bar and tab bar (ios/App/App/KipuViewController.swift).
// On the web every call is a no-op and the HTML header / bottom nav are used instead.

type Insets = { top: number; bottom: number };

interface NativeChromePlugin {
  setNav(options: { title: string | null; back: boolean }): Promise<Insets>;
  setTab(options: { index: number }): Promise<Insets>;
  addListener(event: "tab", listener: (data: { index: number }) => void): Promise<PluginListenerHandle>;
  addListener(event: "back", listener: () => void): Promise<PluginListenerHandle>;
}

export const isNative = Capacitor.isNativePlatform();

const NativeChrome = registerPlugin<NativeChromePlugin>("NativeChrome");

if (isNative) document.documentElement.classList.add("native");

// Exposed to CSS as --chrome-top / --chrome-bottom so pages can leave room for the native bars.
function applyInsets({ top, bottom }: Insets) {
  const root = document.documentElement.style;
  root.setProperty("--chrome-top", `${top}px`);
  root.setProperty("--chrome-bottom", `${bottom}px`);
}

/** Shows the native nav bar with this title, or hides it when title is null. */
export function setNativeNav(title: string | null, back: boolean) {
  if (isNative) NativeChrome.setNav({ title, back }).then(applyInsets, () => {});
}

/** Highlights a tab (-1 for none). */
export function setNativeTab(index: number) {
  if (isNative) NativeChrome.setTab({ index }).then(applyInsets, () => {});
}

export function onNativeTab(listener: (index: number) => void) {
  return NativeChrome.addListener("tab", ({ index }) => listener(index));
}

export function onNativeBack(listener: () => void) {
  return NativeChrome.addListener("back", listener);
}

/** Height hidden behind whatever bar sits at the top of the scroll area. */
export function topObstruction() {
  if (isNative) return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--chrome-top")) || 0;
  return document.querySelector("#scroll-area header")?.getBoundingClientRect().height ?? 0;
}
