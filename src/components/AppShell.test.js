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

  test('mounts the atmosphere for archive-terminal', () => {
    document.documentElement.dataset.uiTheme = 'archive-terminal';

    const { container } = renderShell();

    expect(screen.getByTestId('ambient-canvas')).toBeInTheDocument();
    expect(container.querySelector('.shell-root')).not.toHaveAttribute('style');
  });

  test('keeps the ascii-modern alias compatible', () => {
    document.documentElement.dataset.uiTheme = 'ascii-modern';

    renderShell();

    expect(screen.getByTestId('ambient-canvas')).toBeInTheDocument();
  });

  test('keeps the legacy shell free of the atmosphere', () => {
    document.documentElement.dataset.uiTheme = 'legacy';

    renderShell();

    expect(screen.queryByTestId('ambient-canvas')).not.toBeInTheDocument();
  });
});
