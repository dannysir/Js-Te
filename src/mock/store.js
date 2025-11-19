export const mockStore = new Map();

export function clearAllMocks() {
  mockStore.clear();
}

export function mock(modulePath, mockExports) {
  mockStore.set(modulePath, mockExports);
}

export function unmock(modulePath) {
  mockStore.delete(modulePath);
}

export function isMocked(modulePath) {
  return mockStore.has(modulePath);
}