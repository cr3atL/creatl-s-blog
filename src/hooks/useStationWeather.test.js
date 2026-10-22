import { act, renderHook } from '@testing-library/react';
import useStationWeather from './useStationWeather';

describe('useStationWeather', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('refreshes the fictional forecast on the live event interval', () => {
    const { result, unmount } = renderHook(() => useStationWeather());
    const firstForecast = result.current;

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current).not.toEqual(firstForecast);
    unmount();
  });

  test('cleans up its watcher on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = renderHook(() => useStationWeather());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
