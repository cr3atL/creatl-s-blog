import { resolveUITheme } from './uiTheme';

describe('resolveUITheme', () => {
  test('defaults to the brand theme', () => {
    expect(resolveUITheme(null)).toBe('creatl-brand');
  });

  test('uses a supported configured theme', () => {
    expect(resolveUITheme(null, 'creatl-brand')).toBe('creatl-brand');
    expect(resolveUITheme(null, 'ascii-modern')).toBe('ascii-modern');
    expect(resolveUITheme(null, 'archive-terminal')).toBe('archive-terminal');
  });

  test('lets a supported query override the configured theme', () => {
    expect(resolveUITheme('creatl-brand', 'legacy')).toBe('creatl-brand');
    expect(resolveUITheme('legacy', 'archive-terminal')).toBe('legacy');
    expect(resolveUITheme('ascii-modern', 'legacy')).toBe('ascii-modern');
    expect(resolveUITheme('archive-terminal', 'legacy')).toBe('archive-terminal');
  });

  test('rejects unsupported theme values', () => {
    expect(resolveUITheme('unknown', 'unknown')).toBe('creatl-brand');
  });
});
