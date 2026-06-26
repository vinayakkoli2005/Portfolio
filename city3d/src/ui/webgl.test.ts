import { describe, it, expect, vi } from 'vitest';
import { detectWebGL } from './webgl';

describe('detectWebGL', () => {
  it('returns false when getContext yields null', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as any);
    expect(detectWebGL()).toBe(false);
    spy.mockRestore();
  });

  it('returns true when a webgl context exists', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as any);
    expect(detectWebGL()).toBe(true);
    spy.mockRestore();
  });
});
