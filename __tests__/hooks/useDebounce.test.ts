/**
 * WhatsSound — useDebounce Hook Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../../src/hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('debe llamar callback después del delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('arg1', 'arg2');
    });

    // No debe haber llamado aún
    expect(callback).not.toHaveBeenCalled();

    // Avanzar el tiempo
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Ahora sí
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('debe cancelar llamadas anteriores', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current('call1');
      jest.advanceTimersByTime(200);
      result.current('call2');
      jest.advanceTimersByTime(200);
      result.current('call3');
    });

    // Aún no debe haber llamado
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Solo la última llamada
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call3');
  });

  test('debe funcionar con diferentes delays', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 1000));

    act(() => {
      result.current();
    });

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('debe pasar múltiples argumentos', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));

    act(() => {
      result.current(1, 'two', { three: 3 }, [4]);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledWith(1, 'two', { three: 3 }, [4]);
  });

  test('debe funcionar con callbacks async', async () => {
    const asyncCallback = jest.fn().mockResolvedValue('done');
    const { result } = renderHook(() => useDebounce(asyncCallback, 100));

    act(() => {
      result.current();
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(asyncCallback).toHaveBeenCalled();
  });

  test('debe mantener referencia estable si callback/delay no cambian', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(
      ({ cb, delay }) => useDebounce(cb, delay),
      { initialProps: { cb: callback, delay: 500 } }
    );

    const firstRef = result.current;
    
    rerender({ cb: callback, delay: 500 });
    
    expect(result.current).toBe(firstRef);
  });
});
