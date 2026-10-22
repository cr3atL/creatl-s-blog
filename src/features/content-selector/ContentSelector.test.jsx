import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import ContentSelector from './ContentSelector';
import { folderSearch, parseFolder, readSnapshot, selectionFor } from './selectorState';

vi.mock('../../utils/analytics', () => ({ trackEvent: vi.fn() }));

function Harness() {
  const location = useLocation();
  const navigate = useNavigate();
  return <>
    {location.pathname === '/' ? <ContentSelector /> : <h1>目标页面</h1>}
    <input aria-label="目录外输入" />
    <button onClick={() => navigate(-1)}>浏览器后退</button>
    <button onClick={() => navigate(1)}>浏览器前进</button>
    <output data-testid="address">{location.pathname}{location.search}{location.hash}</output>
    <output data-testid="state">{JSON.stringify(location.state)}</output>
  </>;
}

const setup = (entry = '/') => render(<MemoryRouter initialEntries={[entry]}><Harness /></MemoryRouter>);
const list = () => screen.getByRole('list');

describe('content selector', () => {
  test('hover selects without navigation or stealing outside focus and leaves entries in their original order', () => {
    setup();
    const input = screen.getByRole('textbox');
    input.focus();
    const tools = screen.getByRole('button', { name: '小工具' });
    userEvent.hover(tools);
    expect(tools).toHaveClass('is-selected');
    expect(input).toHaveFocus();
    expect(screen.getByTestId('address')).toHaveTextContent(/^\/$/);
    expect(list().style.getPropertyValue('--selector-index')).toBe('2');
    expect(within(list()).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['音游曲库', '文章与记录', '小工具', '关于我']);
    expect(within(list()).getAllByRole('listitem').every((item) => !item.hasAttribute('style'))).toBe(true);
    userEvent.unhover(tools);
    expect(tools).toHaveClass('is-selected');
    userEvent.click(tools);
    expect(screen.getByRole('link', { name: '随机兔子图片' })).toBeInTheDocument();
  });

  test('hover, wheel and keyboard share selection and activation follows the latest highlighted row', () => {
    setup();
    screen.getByRole('button', { name: '音游曲库' }).focus();
    const article = screen.getByRole('link', { name: '文章与记录' });
    userEvent.hover(article);
    expect(article).toHaveFocus();
    fireEvent.wheel(screen.getByRole('region', { name: '内容目录' }), { deltaY: 120 });
    const tools = screen.getByRole('button', { name: '小工具' });
    expect(tools).toHaveFocus();
    expect(tools).toHaveClass('is-selected');
    fireEvent.keyDown(tools, { key: 'ArrowUp' });
    expect(article).toHaveFocus();
    expect(article).toHaveClass('is-selected');
    userEvent.hover(screen.getByRole('button', { name: '音游曲库' }));
    userEvent.keyboard('{Enter}');
    expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveFocus();
  });

  test('wheel selection moves the sole highlight without opening entries or intercepting the rest of the page', () => {
    setup();
    const region = screen.getByRole('region', { name: '内容目录' });
    const catalog = screen.getByRole('button', { name: '音游曲库' });
    const article = screen.getByRole('link', { name: '文章与记录' });
    expect(fireEvent.wheel(region, { deltaY: 120 })).toBe(false);
    expect(catalog).not.toHaveClass('is-selected');
    expect(article).toHaveClass('is-selected');
    expect(region.querySelectorAll('.is-selected')).toHaveLength(1);
    expect(screen.getByTestId('address')).toHaveTextContent(/^\/$/);
    fireEvent.wheel(region, { deltaY: -120 });
    fireEvent.wheel(region, { deltaY: -120 });
    expect(screen.getByRole('link', { name: '关于我' })).toHaveClass('is-selected');
    expect(fireEvent.wheel(screen.getByRole('textbox'), { deltaY: 120 })).toBe(true);
    expect(screen.getByRole('link', { name: '关于我' })).toHaveClass('is-selected');
  });

  test('wheel preserves outside focus and keeps keyboard focus aligned inside nested directories', () => {
    setup();
    const region = screen.getByRole('region', { name: '内容目录' });
    const input = screen.getByRole('textbox');
    input.focus();
    fireEvent.wheel(region, { deltaY: 120 });
    expect(input).toHaveFocus();
    userEvent.click(screen.getByRole('button', { name: '音游曲库' }));
    expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveFocus();
    fireEvent.wheel(region, { deltaY: 120 });
    const chunithm = screen.getByRole('link', { name: 'CHUNITHM' });
    expect(chunithm).toHaveFocus();
    expect(chunithm).toHaveClass('is-selected');
    fireEvent.keyDown(chunithm, { key: 'ArrowLeft' });
    expect(screen.getByRole('button', { name: '音游曲库' })).toHaveFocus();
  });

  test('shows four root entries and replaces the whole list when entering a folder', async () => {
    setup();
    expect(within(list()).getAllByRole('listitem')).toHaveLength(4);
    userEvent.click(screen.getByRole('button', { name: '音游曲库' }));
    expect(within(list()).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: '音游曲库' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '关于我' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveFocus();
    userEvent.click(screen.getByRole('button', { name: '返回', exact: true }));
    await waitFor(() => expect(screen.getByRole('button', { name: '音游曲库' })).toHaveFocus());
  });

  test('restores tool selection when returning and re-entering', async () => {
    setup();
    userEvent.click(screen.getByRole('button', { name: '小工具' }));
    expect(within(list()).getAllByRole('listitem')).toHaveLength(3);
    fireEvent.keyDown(screen.getByRole('link', { name: '随机兔子图片' }), { key: 'ArrowUp' });
    fireEvent.keyDown(screen.getByRole('link', { name: '赤隼 · Roadster' }), { key: 'ArrowDown' });
    expect(screen.getByRole('link', { name: '随机兔子图片' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('link', { name: '随机兔子图片' }), { key: 'ArrowLeft' });
    await waitFor(() => expect(screen.getByRole('button', { name: '小工具' })).toHaveFocus());
    userEvent.click(screen.getByRole('button', { name: '浏览器前进' }));
    await waitFor(() => expect(screen.getByRole('link', { name: '随机兔子图片' })).toHaveFocus());
    userEvent.click(screen.getByRole('button', { name: '返回', exact: true }));
    await waitFor(() => expect(screen.getByRole('button', { name: '小工具' })).toHaveFocus());
    userEvent.click(screen.getByRole('button', { name: '小工具' }));
    expect(screen.getByRole('link', { name: '随机兔子图片' })).toHaveFocus();
  });

  test('keeps selection changes out of the history stack and supports normal Tab', async () => {
    setup();
    userEvent.tab();
    expect(screen.getByRole('button', { name: '音游曲库' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    expect(screen.getByRole('link', { name: '关于我' })).toHaveFocus();
    expect(screen.getByTestId('address')).toHaveTextContent(/^\/$/);
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    userEvent.keyboard('{Enter}');
    expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    userEvent.click(screen.getByRole('button', { name: '浏览器后退' }));
    await waitFor(() => expect(screen.getByRole('button', { name: '音游曲库' })).toHaveFocus());
    userEvent.tab();
    expect(screen.getByRole('textbox', { name: '目录外输入' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: '音游曲库' })).toHaveAttribute('data-selected', 'true');
  });

  test('preserves query values, hash and unrelated history state across transitions', () => {
    setup({ pathname: '/', search: '?ui=creatl-brand&other=keep', hash: '#updates', state: { shared: 'kept' } });
    userEvent.click(screen.getByRole('button', { name: '小工具' }));
    expect(screen.getByTestId('address')).toHaveTextContent('/?ui=creatl-brand&other=keep&folder=tools#updates');
    expect(screen.getByTestId('state')).toHaveTextContent('"shared":"kept"');
  });

  test('direct folder URLs can return without relying on an earlier history entry', () => {
    setup('/?folder=catalog&other=keep');
    expect(within(list()).getAllByRole('link')).toHaveLength(3);
    userEvent.click(screen.getByRole('button', { name: '返回', exact: true }));
    expect(screen.getByTestId('address')).toHaveTextContent('/?other=keep');
    expect(screen.getByRole('button', { name: '音游曲库' })).toHaveFocus();
  });

  test('route leaves retain their real destinations and return to the last selected row', async () => {
    setup();
    expect(screen.getByRole('link', { name: '文章与记录' })).toHaveAttribute('href', '/article');
    userEvent.click(screen.getByRole('link', { name: '关于我' }));
    expect(screen.getByRole('heading', { name: '目标页面' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '浏览器后退' }));
    await waitFor(() => expect(screen.getByRole('link', { name: '关于我' })).toHaveFocus());
  });

  test('invalid folders and invalid saved selections fall back to valid root entries', () => {
    setup({ pathname: '/', search: '?folder=invalid', state: { contentSelector: { selections: { root: { selectedId: 'missing', scrollTop: -10 } } } } });
    expect(within(list()).getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('button', { name: '音游曲库' })).toHaveAttribute('tabindex', '0');
  });

  test('validates restored state and keeps scroll positions per folder', () => {
    const snapshot = readSnapshot({ contentSelector: { selections: { root: { selectedId: 'tools', scrollTop: 50 }, tools: { selectedId: 'removed-tool', scrollTop: 80 }, catalog: { selectedId: 'missing', scrollTop: Infinity } } } });
    expect(selectionFor(snapshot, 'root')).toEqual({ selectedId: 'tools', scrollTop: 50 });
    expect(selectionFor(snapshot, 'tools')).toEqual({ selectedId: 'random-image', scrollTop: 80 });
    expect(selectionFor(snapshot, 'catalog')).toEqual({ selectedId: 'maimai', scrollTop: 0 });
    expect(parseFolder('?folder=__proto__')).toBe('root');
    expect(folderSearch('?folder=tools&ui=creatl-brand', 'root')).toBe('?ui=creatl-brand');
  });

  test('keeps game leaves under the GitHub Pages basename', () => {
    render(<MemoryRouter basename="/creatl-s-blog" initialEntries={['/creatl-s-blog/?folder=catalog']}><ContentSelector /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'maimai DX' })).toHaveAttribute('href', '/creatl-s-blog/songs/maimai');
    expect(screen.getByRole('link', { name: 'CHUNITHM' })).toHaveAttribute('href', '/creatl-s-blog/songs/chunithm');
    expect(screen.getByRole('link', { name: 'SOUND VOLTEX' })).toHaveAttribute('href', '/creatl-s-blog/songs/sdvx');
  });
});
