import {
  STATION_TIME_ZONE,
  generateStationWeather,
  getStationDateParts,
} from './stationWeather';

describe('stationWeather', () => {
  test('uses the fixed station timezone internally for date keys', () => {
    expect(STATION_TIME_ZONE).toBe('Asia/Shanghai');
    expect(getStationDateParts(new Date('2025-12-31T16:30:00.000Z'))).toEqual({
      stationDate: '2026-01-01',
      stationHour: 0,
    });
  });

  test('is deterministic for the same input and event tick', () => {
    const date = new Date('2026-06-05T04:00:00.000Z');

    expect(generateStationWeather(date, 0, 2)).toEqual(
      generateStationWeather(date, 0, 2)
    );
  });

  test('changes fictional weather when the event tick changes', () => {
    const date = new Date('2026-06-05T04:00:00.000Z');

    expect(generateStationWeather(date, 0, 1)).not.toEqual(
      generateStationWeather(date, 0, 2)
    );
  });

  test('keeps live changes within a plausible drift for the same hour', () => {
    const date = new Date('2026-06-05T04:00:00.000Z');
    const first = generateStationWeather(date, 0, 1);
    const second = generateStationWeather(date, 0, 2);

    expect(second.condition).toBe(first.condition);
    expect(second.direction).toBe(first.direction);
    expect(Math.abs(second.temperature - first.temperature)).toBeLessThanOrEqual(4);
    expect(Math.abs(second.wind - first.wind)).toBeLessThanOrEqual(4);
  });

  test('returns values within expected fictional station ranges', () => {
    const weather = generateStationWeather(new Date('2026-06-05T04:00:00.000Z'));

    expect(weather.stationName).toBe('CreatL Station');
    expect(weather.temperature).toBeGreaterThanOrEqual(32);
    expect(weather.temperature).toBeLessThanOrEqual(100);
    expect(weather.wind).toBeGreaterThanOrEqual(2);
    expect(weather.wind).toBeLessThanOrEqual(24);
    expect(weather.direction).toMatch(/^(N|NE|E|SE|S|SW|W|NW)$/);
    expect(weather.humidity).toBeGreaterThanOrEqual(28);
    expect(weather.humidity).toBeLessThanOrEqual(92);
    expect(weather.signal).toBeGreaterThanOrEqual(68);
    expect(weather.signal).toBeLessThanOrEqual(99);
    expect(weather.event).toBeTruthy();
    expect(weather.pulse).toBeGreaterThanOrEqual(1);
    expect(weather.pulse).toBeLessThanOrEqual(9);
  });

  test('creates a real offset date before generating date keys', () => {
    expect(
      getStationDateParts(new Date('2025-01-31T12:00:00+08:00'), 1).stationDate
    ).toBe('2025-02-01');
    expect(
      getStationDateParts(new Date('2025-12-31T12:00:00+08:00'), 1).stationDate
    ).toBe('2026-01-01');
    expect(
      getStationDateParts(new Date('2026-01-01T12:00:00+08:00'), -1).stationDate
    ).toBe('2025-12-31');
    expect(
      getStationDateParts(new Date('2024-02-29T12:00:00+08:00'), 1).stationDate
    ).toBe('2024-03-01');
  });
});
