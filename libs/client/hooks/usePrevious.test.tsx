import { renderHook } from '@testing-library/react-hooks';
import { usePrevious } from './usePrevious';

describe('usePrevious hook', () => {
  it('should return previous value', () => {
    const { result, rerender } = renderHook((val: string) => usePrevious(val), {
      initialProps: 'test1',
    });
    expect(result.current).toBe(undefined);
    rerender('test2');
    expect(result.current).toBe('test1');
    rerender('test3');
    expect(result.current).toBe('test2');
  });
});
