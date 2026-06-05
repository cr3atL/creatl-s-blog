import { resolveUITheme } from './uiTheme';

describe('resolveUITheme', () => {
  test('defaults to legacy for rollback safety', () => {
    expect(resolveUITheme(null)).toBe('legacy');
  });

  test('uses a supported configured theme', () => {
    expect(resolveUITheme(null, 'ascii-modern')).toBe('ascii-modern');
    expect(resolveUITheme(null, 'archive-terminal')).toBe('archive-terminal');
  });

  test('lets a supported query override the configured theme', () => {
    expect(resolveUITheme('legacy', 'archive-terminal')).toBe('legacy');
    expect(resolveUITheme('ascii-modern', 'legacy')).toBe('ascii-modern');
    expect(resolveUITheme('archive-terminal', 'legacy')).toBe('archive-terminal');
  });

  test('rejects unsupported theme values', () => {
    expect(resolveUITheme('unknown', 'unknown')).toBe('legacy');
  });
});
