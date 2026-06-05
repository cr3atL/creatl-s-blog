import { act, fireEvent, render, screen } from '@testing-library/react';
import About from './About';
import Article from './Article';
import Home from './Home';
import NotFound from './NotFound';
import RaceSignon from './RaceSignon';
import Randomssiba from './Randomssiba';
import Tools from './Tools';
import { trackEvent } from '../utils/analytics';

const mockNavigate = jest.fn();
const mockMessageError = jest.fn();
const mockMessageInfo = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock('../components/ResponsiveLayout', () => ({ children }) => <>{children}</>);

jest.mock('../utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('./Randomssiba', () => () => (
  <div>
    <button>换一张</button>
    <button disabled>下载图片</button>
  </div>
));

jest.mock('@ant-design/icons', () => ({
  DownloadOutlined: () => <span />,
  GithubOutlined: (props) => <button aria-label="GitHub" {...props} />,
  PictureOutlined: () => <span />,
  ReloadOutlined: () => <span />,
  TrophyOutlined: () => <span />,
}));

jest.mock('antd', () => {
  const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
  Form.Item = ({ children, label }) => (
    <div>
      {label && <label>{label}</label>}
      {children}
    </div>
  );

  const List = ({ dataSource, renderItem }) => <div>{dataSource.map(renderItem)}</div>;
  List.Item = ({ children }) => <article>{children}</article>;

  return {
    Avatar: ({ children, ...props }) => <div {...props}>{children}</div>,
    Card: ({ children, hoverable, ...props }) => <section {...props}>{children}</section>,
    Button: ({ children, loading, ...props }) => <button {...props}>{children}</button>,
    Form,
    Input: (props) => <input {...props} />,
    List,
    Space: ({ children }) => <div>{children}</div>,
    Spin: () => <div role="status">loading</div>,
    Tag: ({ children }) => <span>{children}</span>,
    message: {
      useMessage: () => [
        {
          error: mockMessageError,
          info: mockMessageInfo,
        },
        <div key="message-holder" />,
      ],
    },
    Typography: {
      Title: ({ children }) => <h1>{children}</h1>,
      Paragraph: ({ children, ...props }) => <p {...props}>{children}</p>,
    },
  };
});

describe('critical page interactions', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockMessageError.mockClear();
    mockMessageInfo.mockClear();
    trackEvent.mockClear();
    window.open = jest.fn();
    document.documentElement.dataset.uiTheme = 'ascii-modern';
  });

  test('home renders generated station weather only in the new theme', () => {
    render(<Home />);

    expect(screen.getByText('weather --station creatl --live')).toBeInTheDocument();
    expect(screen.getByText('CREATL STATION / GENERATED INTERNAL CLIMATE')).toBeInTheDocument();
    expect(screen.getByText(/站内虚构预报/)).toBeInTheDocument();
  });

  test('legacy home does not render station weather', () => {
    document.documentElement.dataset.uiTheme = 'legacy';

    const { container } = render(<Home />);

    expect(screen.queryByText('CreatL Station')).not.toBeInTheDocument();
    expect(container.querySelector('.home-hero__identity')).not.toBeInTheDocument();
  });

  test('home tool actions preserve navigation and analytics events', () => {
    render(<Home />);

    const openButtons = screen.getAllByRole('button', { name: '打开' });
    fireEvent.click(openButtons[0]);
    fireEvent.click(openButtons[1]);

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/randomssiba');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/race-signon');
    expect(trackEvent).toHaveBeenNthCalledWith(1, 'Navigation', 'Click', 'Random_Image');
    expect(trackEvent).toHaveBeenNthCalledWith(2, 'Navigation', 'Click', 'Race_Signon');
  });

  test('home social links preserve analytics and external navigation', () => {
    render(<Home />);

    fireEvent.click(screen.getByLabelText('GitHub'));

    expect(trackEvent).toHaveBeenCalledWith('Social_Media', 'Click', 'GitHub');
    expect(window.open).toHaveBeenCalledWith('https://github.com/cr3atL', '_blank');
  });

  test('tools preserve both destinations', () => {
    render(<Tools />);

    const openButtons = screen.getAllByRole('button', { name: '打开' });
    fireEvent.click(openButtons[0]);
    fireEvent.click(openButtons[1]);

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/randomssiba');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/race-signon');
  });

  test('not found returns home', () => {
    render(<NotFound />);

    fireEvent.click(screen.getByRole('button', { name: '返回首页' }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('not found keeps the stronger ASCII state decorative', () => {
    const { container } = render(<NotFound />);

    expect(screen.getByText('页面不存在')).toBeInTheDocument();
    expect(container.querySelector('.not-found-ascii')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  test('article action still shows the unfinished message', () => {
    render(<Article />);

    fireEvent.click(screen.getByRole('button', { name: '阅读全文' }));

    expect(mockMessageInfo).toHaveBeenCalledWith('这篇还没写完 >_<');
  });

  test('about avatar interaction and links remain available', () => {
    render(<About />);

    fireEvent.click(screen.getByText('CreatL').closest('section').querySelector('.about-avatar'));

    expect(mockMessageError).toHaveBeenCalledWith('不准摸！');
    expect(screen.getByText('点击添加我的 QQ')).toHaveAttribute(
      'href',
      'https://qm.qq.com/q/MFdHgohGqm'
    );
    expect(screen.getByText('cr3atL')).toHaveAttribute(
      'href',
      'https://github.com/cr3atL'
    );
  });

  test('race sign-on keeps the existing fields and submit control', () => {
    render(<RaceSignon />);

    expect(screen.getByText('游戏 ID')).toBeInTheDocument();
    expect(screen.getByText('RATING')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '报名' })).toBeInTheDocument();
  });

  test('random image keeps reload and disabled download controls', () => {
    jest.useFakeTimers();

    render(<Randomssiba />);

    expect(screen.getByRole('button', { name: '换一张' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();

    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });
});
