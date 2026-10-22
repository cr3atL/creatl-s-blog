import { render, screen } from '@testing-library/react';
import App from './App';
import { trackPageView } from './utils/analytics';
import { StrictMode } from 'react';

vi.hoisted(() => { vi.stubEnv('VITE_GA_TRACK_ID', 'G-TEST'); });

let mockRouterBasename;
let mockLocation = { pathname: '/', search: '' };

vi.mock(
  'react-router-dom',
  async () => {
    const React = await import('react');

    const matchesPath = (routePath, pathname) => {
      if (routePath === '*') {
        return true;
      }

      return routePath === pathname;
    };

    return {
      BrowserRouter: ({ basename, children }) => {
        mockRouterBasename = basename;
        return <>{children}</>;
      },
      Routes: ({ children }) => {
        const pathname =
          globalThis.location.pathname.replace('/creatl-s-blog', '') || '/';
        const routes = React.Children.toArray(children);
        const route =
          routes.find((child) => matchesPath(child.props.path, pathname)) ||
          routes.find((child) => child.props.path === '*');

        return route?.props.element ?? null;
      },
      Route: () => null,
      useLocation: () => mockLocation,
    };
  }
);

vi.mock('./utils/analytics', () => ({
  initGA: vi.fn(),
  trackPageView: vi.fn(),
}));

vi.mock('./Page/Home', () => ({ default: () => <div>home-page</div> }));
vi.mock('./Page/About', () => ({ default: () => <div>about-page</div> }));
vi.mock('./Page/Article', () => ({ default: () => <div>article-page</div> }));
vi.mock('./Page/Tools', () => ({ default: () => <div>tools-page</div> }));
vi.mock('./Page/Randomssiba', () => ({ default: () => <div>random-image-page</div> }));
vi.mock('./Page/NotFound', () => ({ default: () => <div>not-found-page</div> }));

const routeCases = [
  ['/', 'home-page'],
  ['/home', 'home-page'],
  ['/about', 'about-page'],
  ['/article', 'article-page'],
  ['/tools', 'tools-page'],
  ['/randomssiba', 'random-image-page'],
  ['/race-signon', 'not-found-page'],
  ['/missing-route', 'not-found-page'],
];

describe('application routes', () => {
  beforeEach(() => { mockLocation = { pathname: '/', search: '' }; vi.clearAllMocks(); });

  test('tracks addresses once while selection-only history updates do not add page views', () => {
    const { rerender } = render(<App />);
    expect(trackPageView).toHaveBeenCalledTimes(1);
    mockLocation = { pathname: '/', search: '', state: { selectedId: 'tools' }, key: 'new-key' };
    rerender(<App />);
    expect(trackPageView).toHaveBeenCalledTimes(1);
    mockLocation = { pathname: '/', search: '?folder=tools' };
    rerender(<App />);
    expect(trackPageView).toHaveBeenCalledTimes(2);
    expect(trackPageView).toHaveBeenLastCalledWith('/?folder=tools');
  });

  test('does not duplicate the initial page view under StrictMode', () => {
    render(<StrictMode><App /></StrictMode>);
    expect(trackPageView).toHaveBeenCalledTimes(1);
  });
  test.each(routeCases)('renders %s', async (path, expectedPage) => {
    window.history.pushState({}, '', `/creatl-s-blog${path}`);

    render(<App />);

    expect(await screen.findByText(expectedPage)).toBeInTheDocument();
  });

  test('preserves the GitHub Pages basename', () => {
    window.history.pushState({}, '', '/creatl-s-blog/');

    render(<App />);

    expect(mockRouterBasename).toBe('/creatl-s-blog');
  });
});
