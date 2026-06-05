import { resolveUITheme } from './uiTheme';

describe('resolveUITheme', () => {
  test('defaults to legacy for rollback safety', () => {
    expect(resolveUITheme(null)).toBe('legacy');
  });

  test('uses a supported configured theme', () => {
    expect(resolveUITheme(null, 'ascii-modern')).toBe('ascii-modern');
  });

  test('lets a supported query override the configured theme', () => {
    expect(resolveUITheme('legacy', 'ascii-modern')).toBe('legacy');
    expect(resolveUITheme('ascii-modern', 'legacy')).toBe('ascii-modern');
  });

  test('rejects unsupported theme values', () => {
    expect(resolveUITheme('unknown', 'unknown')).toBe('legacy');
  });
});
