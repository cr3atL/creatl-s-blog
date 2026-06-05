import { render, screen } from '@testing-library/react';
import AppShell from './AppShell';

jest.mock('antd', () => {
  const Layout = ({ children, ...props }) => <div {...props}>{children}</div>;
  Layout.Content = ({ children, ...props }) => <main {...props}>{children}</main>;
  Layout.Footer = ({ children, ...props }) => <footer {...props}>{children}</footer>;

  return { Layout };
});

jest.mock('./ambient/AmbientCanvas', () => () => (
  <canvas data-testid="ambient-canvas" />
));

describe('AppShell atmosphere integration', () => {
  const renderShell = () =>
    render(
      <AppShell header={() => <header>header</header>}>
        content
      </AppShell>
    );

  test('mounts the atmosphere only for ascii-modern', () => {
    document.documentElement.dataset.uiTheme = 'ascii-modern';

    const { container } = renderShell();

    expect(screen.getByTestId('ambient-canvas')).toBeInTheDocument();
    expect(container.querySelector('.shell-root')).not.toHaveAttribute('style');
  });

  test('keeps the legacy shell free of the atmosphere', () => {
    document.documentElement.dataset.uiTheme = 'legacy';

    renderShell();

    expect(screen.queryByTestId('ambient-canvas')).not.toBeInTheDocument();
  });
});
