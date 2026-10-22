import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import About from './About';
import Article from './Article';
import Home from './Home';
import NotFound from './NotFound';
import Tools from './Tools';
import { trackEvent } from '../utils/analytics';
import socialLinks from '../data/socialLinks';
import archiveLogs from '../data/archiveLogs';

const mockMessageInfo = vi.hoisted(() => vi.fn());
vi.mock('../components/ResponsiveLayout', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('../utils/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('antd', () => {
  const Form = ({ children, onFinish, ...props }) => <form {...props} onSubmit={event => { event.preventDefault(); onFinish?.(); }}>{children}</form>;
  Form.Item = ({ children, label, name }) => <div>{label && <label htmlFor={name}>{label}</label>}{children && name ? <div>{children}</div> : children}</div>;
  return {
    Button: ({ children, loading, icon, size, type, htmlType, ...props }) => <button {...props} type={htmlType || 'button'}>{children}</button>,
    Form,
    Input: props => <input {...props} />,
    message: { useMessage: () => [{ info: mockMessageInfo }, <div key="holder" />] },
  };
});

function Location() { const location = useLocation(); return <span data-testid="location">{location.pathname}{location.search}</span>; }
function show(page, initial = '/') { return render(<MemoryRouter initialEntries={[initial]}>{page}<Location /></MemoryRouter>); }

describe('critical page interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    document.documentElement.dataset.uiTheme = 'creatl-brand';
  });

  test('the common home content remains available with the legacy theme parameter', () => {
    document.documentElement.dataset.uiTheme = 'legacy';
    show(<Home />);
    expect(screen.getByRole('heading', { name: '桔子酱 / creatL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /音游曲库/ })).toBeInTheDocument();
  });

  test('home tool directory preserves destinations and analytics', () => {
    show(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /小工具/ }));
    const list = screen.getByRole('list', { name: '小工具' });
    expect(within(list).getByRole('link', { name: /随机兔子图片/ })).toHaveAttribute('href', '/randomssiba');
    expect(within(list).getAllByRole('link')).toHaveLength(1);
    fireEvent.click(within(list).getByRole('link', { name: /随机兔子图片/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/randomssiba');
    expect(trackEvent).toHaveBeenCalledWith('Navigation', 'Click', 'Random_Image');
  });

  test('home catalog directory preserves all game destinations', () => {
    show(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /音游曲库/ }));
    for (const [name, path] of [['maimai DX', 'maimai'], ['CHUNITHM', 'chunithm'], ['SOUND VOLTEX', 'sdvx']]) {
      expect(screen.getByRole('link', { name: new RegExp(name) })).toHaveAttribute('href', '/songs/' + path);
    }
  });

  test('home social links preserve every account and analytics event', () => {
    show(<Home />);
    for (const link of socialLinks) {
      fireEvent.click(screen.getByRole('button', { name: link.label, exact: true }));
      expect(trackEvent).toHaveBeenCalledWith('Social_Media', 'Click', link.platform);
      expect(window.open).toHaveBeenCalledWith(link.url, '_blank');
    }
  });

  test('home shows original logo, current updates and writing destination', () => {
    show(<Home />);
    expect(screen.getByRole('img', { name: 'creatL' })).toBeInTheDocument();
    const updates = screen.getByRole('list', { name: '最近更新' });
    expect(within(updates).getAllByRole('listitem')).toHaveLength(archiveLogs.length);
    for (const log of archiveLogs) expect(within(updates).getByText(log.title)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /文章与记录/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/article');
    expect(trackEvent).toHaveBeenCalledWith('Navigation', 'Click', 'Writing_Preview');
  });

  test('home directory has four real entries and no invented status', () => {
    show(<Home />);
    expect(within(screen.getByRole('list', { name: '主目录' })).getAllByRole('listitem')).toHaveLength(4);
    expect(screen.queryByText('READY')).not.toBeInTheDocument();
    expect(screen.queryByText('STANDBY')).not.toBeInTheDocument();
  });

  test.each([
    ['随机兔子图片', '/randomssiba'],
    ['音游曲库', '/songs'],
  ])('tools preserve %s destination and analytics', (name, path) => {
    show(<Tools />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
    expect(screen.getByTestId('location')).toHaveTextContent(path);
    expect(trackEvent).toHaveBeenCalledWith('Navigation', 'Click', 'Tools_Page');
  });

  test('not found returns home and keeps its error code decorative', () => {
    show(<NotFound />, '/missing-page');
    fireEvent.click(screen.getByRole('button', { name: '返回首页' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/');
    expect(trackEvent).toHaveBeenCalledWith('Navigation', 'Click', 'NotFound_ReturnHome');
    expect(screen.getByText('404')).toHaveAttribute('aria-hidden', 'true');
  });

  test('article still reports unfinished work and records the original event', () => {
    show(<Article />);
    expect(screen.getByText('尚未完成，暂无全文')).toBeInTheDocument();
    expect(screen.getByText('随手写一点入门体验和个人理解。')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /查看进度 Osu!mania 怎么玩/ }));
    expect(mockMessageInfo).toHaveBeenCalledWith('这篇还没写完 >_<');
    expect(trackEvent).toHaveBeenCalledWith('Article', 'Click', 'osu-mania-how-to-play');
  });

  test('about preserves avatar and every real social account without duplicate links', () => {
    show(<About />);
    expect(screen.getByAltText('creatL 头像')).toBeInTheDocument();
    for (const link of socialLinks) {
      const contact = screen.getByRole('link', { name: new RegExp(link.label.replace(/[!]/g, '\\!')) });
      expect(contact).toHaveAttribute('href', link.url);
      fireEvent.click(contact);
      expect(trackEvent).toHaveBeenCalledWith('Social_Media', 'Click', link.platform);
      expect(window.open).toHaveBeenCalledWith(link.url, '_blank', 'noopener,noreferrer');
    }
    expect(screen.getAllByRole('link')).toHaveLength(socialLinks.length);
  });

});
