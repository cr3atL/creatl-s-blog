import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { ThemeConfig } from 'antd';
import MotionConfigProvider from './MotionConfigProvider';

vi.mock('antd', () => ({ ConfigProvider: ({ theme, children }: { theme: ThemeConfig; children: ReactNode }) =>
  <div data-testid="configuration" data-motion={String(theme.token?.motion)} data-primary={theme.token?.colorPrimary}>{children}</div> }));

test('responds to reduced-motion changes without losing the active theme or children', () => {
  let listener: ((event: { matches: boolean }) => void) | undefined;
  const remove = vi.fn();
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false,
    addEventListener: (_name: string, callback: typeof listener) => { listener = callback; },
    removeEventListener: remove,
  })));
  const view = render(<MotionConfigProvider theme={{ token: { colorPrimary: '#995000' } }}>站点内容</MotionConfigProvider>);
  expect(screen.getByTestId('configuration')).toHaveAttribute('data-motion', 'true');
  act(() => listener?.({ matches: true }));
  expect(screen.getByTestId('configuration')).toHaveAttribute('data-motion', 'false');
  expect(screen.getByTestId('configuration')).toHaveAttribute('data-primary', '#995000');
  expect(screen.getByText('站点内容')).toBeInTheDocument();
  act(() => listener?.({ matches: false }));
  expect(screen.getByTestId('configuration')).toHaveAttribute('data-motion', 'true');
  view.unmount();
  expect(remove).toHaveBeenCalled();
  vi.unstubAllGlobals();
});
