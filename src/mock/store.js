export const __mockRegistry__ = new Map();

export function clearAllMocks() {
  __mockRegistry__.clear();
}

export function mock(modulePath, mockExports) {
  __mockRegistry__.set(modulePath, mockExports);
}

export function unmock(modulePath) {
  __mockRegistry__.delete(modulePath);
}

export function isMocked(modulePath) {
  return __mockRegistry__.has(modulePath);
}