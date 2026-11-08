// Polyfill for import.meta to fix "Cannot use 'import.meta' outside a module" error
if (typeof import.meta === 'undefined') {
  globalThis.import.meta = {
    url: typeof window !== 'undefined' ? window.location.href : '',
  };
}
