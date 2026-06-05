import {
  STATION_TIME_ZONE,
  generateStationWeather,
  getStationDateParts,
} from './stationWeather';

describe('stationWeather', () => {
  test('uses the fixed CreatL Station timezone', () => {
    expect(STATION_TIME_ZONE).toBe('Asia/Shanghai');
    expect(getStationDateParts(new Date('2025-12-31T16:30:00.000Z'))).toEqual({
      stationDate: '2026-01-01',
      stationHour: 0,
    });
  });

  test('is deterministic for the same input', () => {
    const date = new Date('2026-06-05T04:00:00.000Z');

    expect(generateStationWeather(date)).toEqual(generateStationWeather(date));
  });

  test('returns values within expected fictional station ranges', () => {
    const weather = generateStationWeather(new Date('2026-06-05T04:00:00.000Z'));

    expect(weather.stationName).toBe('CreatL Station');
    expect(weather.temperature).toBeGreaterThanOrEqual(6);
    expect(weather.temperature).toBeLessThanOrEqual(31);
    expect(weather.wind).toBeGreaterThanOrEqual(5);
    expect(weather.wind).toBeLessThanOrEqual(24);
    expect(weather.direction).toMatch(/^(N|NE|E|SE|S|SW|W|NW)$/);
    expect(weather.humidity).toBeGreaterThanOrEqual(42);
    expect(weather.humidity).toBeLessThanOrEqual(84);
    expect(weather.signal).toBeGreaterThanOrEqual(72);
    expect(weather.signal).toBeLessThanOrEqual(99);
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
