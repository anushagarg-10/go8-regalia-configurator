import "@testing-library/jest-dom/vitest";

// The jsdom environment in this setup does not provide localStorage;
// back it with an in-memory Storage shim so auth/saved-look logic is testable.
if (typeof window !== "undefined" && !window.localStorage) {
  const store = new Map<string, string>();
  const shim: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => (store.has(key) ? (store.get(key) as string) : null),
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(window, "localStorage", { value: shim, configurable: true });
  Object.defineProperty(globalThis, "localStorage", { value: shim, configurable: true });
}
