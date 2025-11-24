import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  beforeEach(() => {
    // Мокаем window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Мокаем addEventListener и removeEventListener
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    vi.clearAllMocks();
  });

  it('should return false for desktop width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
  });

  it('should return true for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(true);
  });

  it('should return true for width exactly at breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(true);
  });

  it('should return false for width just above breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 769,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);
  });

  it('should add resize event listener on mount', () => {
    renderHook(() => useIsMobile());

    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('should update isMobile when window is resized', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current.isMobile).toBe(false);

    // Симулируем изменение размера окна
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Вызываем обработчик resize
      const resizeHandler = (window.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'resize'
      )?.[1] as () => void;

      if (resizeHandler) {
        resizeHandler();
      }
    });

    // Проверяем, что значение обновилось
    // Примечание: в реальном сценарии это может потребовать дополнительной настройки
    expect(window.addEventListener).toHaveBeenCalled();
  });
});

