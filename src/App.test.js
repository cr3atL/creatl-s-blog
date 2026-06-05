import { render, screen } from '@testing-library/react';
import App from './App';

let mockRouterBasename;

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');

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
      useLocation: () => ({ pathname: '/', search: '' }),
    };
  },
  { virtual: true }
);

jest.mock('./utils/analytics', () => ({
  initGA: jest.fn(),
  trackPageView: jest.fn(),
}));

jest.mock('./Page/Home', () => () => <div>home-page</div>);
jest.mock('./Page/About', () => () => <div>about-page</div>);
jest.mock('./Page/Article', () => () => <div>article-page</div>);
jest.mock('./Page/Tools', () => () => <div>tools-page</div>);
jest.mock('./Page/Randomssiba', () => () => <div>random-image-page</div>);
jest.mock('./Page/RaceSignon', () => () => <div>race-signon-page</div>);
jest.mock('./Page/NotFound', () => () => <div>not-found-page</div>);

const routeCases = [
  ['/', 'home-page'],
  ['/home', 'home-page'],
  ['/about', 'about-page'],
  ['/article', 'article-page'],
  ['/tools', 'tools-page'],
  ['/randomssiba', 'random-image-page'],
  ['/race-signon', 'race-signon-page'],
  ['/missing-route', 'not-found-page'],
];

describe('application routes', () => {
  test.each(routeCases)('renders %s', (path, expectedPage) => {
    window.history.pushState({}, '', `/creatl-s-blog${path}`);

    render(<App />);

    expect(screen.getByText(expectedPage)).toBeInTheDocument();
  });

  test('preserves the GitHub Pages basename', () => {
    window.history.pushState({}, '', '/creatl-s-blog/');

    render(<App />);

    expect(mockRouterBasename).toBe('/creatl-s-blog');
  });
});
