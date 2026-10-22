import { render, screen } from '@testing-library/react';
import AppShell from './AppShell';
import { MemoryRouter } from 'react-router-dom';

vi.mock('antd', () => {
  const Layout = ({ children, ...props }) => <div {...props}>{children}</div>;
  Layout.Content = ({ children, ...props }) => <main {...props}>{children}</main>;
  Layout.Footer = ({ children, ...props }) => <footer {...props}>{children}</footer>;

  return { Layout };
});

vi.mock('./ambient/AmbientCanvas', () => ({ default: () => (
  <canvas data-testid="ambient-canvas" />
) }));

describe('AppShell atmosphere integration', () => {
  const renderShell = () =>
    render(
      <MemoryRouter><AppShell header={() => <header>header</header>}>
        content
      </AppShell></MemoryRouter>
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

  test('provides a main landmark and skip link without decorative status for the brand shell', () => {
    document.documentElement.dataset.uiTheme = 'creatl-brand';
    renderShell();
    expect(screen.getByRole('main')).toHaveTextContent('content');
    expect(screen.getByRole('link', { name: '跳到正文' })).toHaveAttribute('href', '#main-content');
    expect(screen.queryByTestId('ambient-canvas')).not.toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).not.toHaveTextContent(/ONLINE|BUILT WITH REACT/);
  });
});
