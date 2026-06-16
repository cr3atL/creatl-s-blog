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
  GithubOutlined: (props) => <span {...props} />,
  MenuOutlined: () => <span />,
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

    expect(screen.queryByText('weather --station creatl --live')).not.toBeInTheDocument();
    expect(container.querySelector('.archive-hero')).not.toBeInTheDocument();
  });

  test('home tool actions preserve navigation and analytics events', () => {
    render(<Home />);

    const toolOpenButtons = screen.getAllByRole('button', { name: /OPEN .+ \((READY|DRAFT|ARCHIVED|COMING SOON)\)/ });
    expect(toolOpenButtons.length).toBeGreaterThanOrEqual(3);

    fireEvent.click(toolOpenButtons[0]);
    fireEvent.click(toolOpenButtons[1]);
    fireEvent.click(toolOpenButtons[2]);

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/randomssiba');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/songs');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, '/race-signon');
    expect(trackEvent).toHaveBeenNthCalledWith(1, 'Navigation', 'Click', 'Random_Image');
    expect(trackEvent).toHaveBeenNthCalledWith(2, 'Navigation', 'Click', 'Song_Catalog');
    expect(trackEvent).toHaveBeenNthCalledWith(3, 'Navigation', 'Click', 'Race_Signon');
  });

  test('home social links preserve analytics and external navigation', () => {
    render(<Home />);

    fireEvent.click(screen.getByLabelText('GitHub'));

    expect(trackEvent).toHaveBeenCalledWith('Social_Media', 'Click', 'GitHub');
    expect(window.open).toHaveBeenCalledWith('https://github.com/cr3atL', '_blank');
  });

  test('home removes avatar and renders archive sections', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('.archive-hero')).toBeInTheDocument();
    expect(container.querySelectorAll('.page-heading-avatar')).toHaveLength(0);
    expect(screen.getByText('ARCHIVE LOG')).toBeInTheDocument();
    expect(screen.getByText('SELECTED TOOLS')).toBeInTheDocument();
    expect(screen.getByText('WRITING PREVIEW')).toBeInTheDocument();
    expect(
      screen.getByText('[EMPTY] articles are being organized')
    ).toBeInTheDocument();
  });

  test('home process rows include numbered entries and statuses', () => {
    render(<Home />);

    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText('002')).toBeInTheDocument();
    expect(screen.getAllByText('READY').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DRAFT').length).toBeGreaterThan(0);
  });

  test('archive log entries expose date and category inline', () => {
    const { container } = render(<Home />);
    const log = container.querySelector('.archive-log');

    expect(log).toBeInTheDocument();
    expect(log.querySelector('.archive-log__date-value').textContent).toMatch(
      /^2026\.06$/
    );
    expect(log.textContent).toMatch(/THEME/);
    expect(log.textContent).toMatch(/TOOLS/);
    expect(log.textContent).toMatch(/NOTE/);
    expect(log.textContent).toMatch(/SIGNAL/);
  });

  test('process row open button includes the tool status in its accessible name', () => {
    render(<Home />);

    expect(
      screen.getByRole('button', { name: /OPEN 随机兔子图片 \(READY\)/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /OPEN Song Catalog \(READY\)/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /OPEN 比赛报名 \(DRAFT\)/ })
    ).toBeInTheDocument();
  });

  test('home secondary navigation links preserve analytics and routing', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: /VIEW ALL TOOLS/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/tools');
    expect(trackEvent).toHaveBeenCalledWith(
      'Navigation',
      'Click',
      'Tools_Directory'
    );

    fireEvent.click(screen.getByRole('button', { name: /OPEN WRITING/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/article');
  });

  test('tools preserve all destinations in the new queue', () => {
    render(<Tools />);

    const openButtons = screen.getAllByRole('button', { name: /OPEN/ });
    fireEvent.click(openButtons[0]);
    fireEvent.click(openButtons[1]);
    fireEvent.click(openButtons[2]);

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/randomssiba');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/songs');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, '/race-signon');
  });

  test('not found returns home and keeps the ASCII frame decorative', () => {
    const { container } = render(<NotFound />);

    fireEvent.click(screen.getByRole('button', { name: /RETURN HOME/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(trackEvent).toHaveBeenCalledWith(
      'Navigation',
      'Click',
      'NotFound_ReturnHome'
    );
    expect(container.querySelector('.not-found-ascii')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  test('article action still shows the unfinished message', () => {
    render(<Article />);

    fireEvent.click(
      screen.getByRole('button', { name: /阅读全文 Osu!mania 怎么玩/ })
    );

    expect(mockMessageInfo).toHaveBeenCalledWith('这篇还没写完 >_<');
    expect(trackEvent).toHaveBeenCalledWith(
      'Article',
      'Click',
      'osu-mania-how-to-play'
    );
  });

  test('about page renders avatar and contact links', () => {
    render(<About />);

    expect(screen.getByAltText('creatL 头像')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/cr3atL'
    );
    expect(screen.getAllByRole('link', { name: 'QQ' }).length).toBeGreaterThan(0);
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
