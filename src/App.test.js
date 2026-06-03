import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');

    return {
      BrowserRouter: ({ children }) => <>{children}</>,
      Routes: ({ children }) => {
        const homeRoute = React.Children.toArray(children).find(
          (child) => child.props.path === '/'
        );

        return homeRoute?.props.element ?? null;
      },
      Route: () => null,
      useLocation: () => ({ pathname: '/', search: '' }),
      useNavigate: () => jest.fn(),
    };
  },
  { virtual: true }
);

jest.mock('antd/es/list/Item', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('antd', () => {
  const React = require('react');
  const Component = (tag) => ({ children }) =>
    React.createElement(tag, null, children);
  const Layout = Component('div');

  Layout.Header = Component('header');
  Layout.Content = Component('main');
  Layout.Footer = Component('footer');

  return {
    __esModule: true,
    Avatar: Component('div'),
    Button: Component('button'),
    Card: Component('section'),
    Drawer: Component('aside'),
    Layout,
    Menu: Component('nav'),
    Typography: {
      Title: Component('h1'),
      Paragraph: Component('p'),
    },
  };
});

jest.mock('./utils/analytics', () => ({
  initGA: jest.fn(),
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
}));

jest.mock('./components/ParticleCanvas', () => ({
  __esModule: true,
  default: () => <canvas />,
}));

jest.mock('./Page/Randomssiba', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./Page/Article', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./Page/About', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./Page/Tools', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./Page/RaceSignon', () => ({
  __esModule: true,
  default: () => null,
}));

test('renders the blog app shell', () => {
  window.history.pushState({}, '', '/creatl-s-blog/');

  render(<App />);

  expect(screen.getByText(/creatL's Blog/i)).toBeInTheDocument();
});
