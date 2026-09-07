/**
 * Stable pseudo-address for a heap object. Deterministic so the same object
 * always shows the same pointer across renders and reloads.
 */
export function addr(id: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `0x${((h >>> 0) % 0xffff).toString(16).padStart(4, '0')}`;
}
