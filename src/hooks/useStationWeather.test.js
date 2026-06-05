import { renderHook } from '@testing-library/react';
import useStationWeather from './useStationWeather';

describe('useStationWeather', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('keeps the forecast stable across ordinary clock ticks', () => {
    const { result, unmount } = renderHook(() => useStationWeather());
    const firstForecast = result.current;

    jest.advanceTimersByTime(30 * 1000);

    expect(result.current).toEqual(firstForecast);
    unmount();
  });

  test('cleans up its date watcher on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = renderHook(() => useStationWeather());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
