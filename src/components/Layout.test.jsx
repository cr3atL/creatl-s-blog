import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

vi.mock('./AppShell', () => ({ default: ({ children, header }) => <>{header()}<main>{children}</main></> }));
vi.mock('antd', () => ({
  Button: ({ children, icon, ref, type, ...props }) => <button ref={ref} {...props}>{icon}{children}</button>,
  Drawer: ({ children, onClose, rootClassName, open }) => open && <div className={rootClassName}>
    <div className="ant-drawer-mask" />
    <div className="ant-drawer-content-wrapper"><button onClick={onClose}>关闭导航</button>{children}</div>
  </div>,
}));
const animations = [];
const listeners = new Set();
const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
beforeEach(() => {
  animations.length = 0; listeners.clear(); media.matches = false;
  media.addEventListener = vi.fn((_event, callback) => listeners.add(callback));
  media.removeEventListener = vi.fn((_event, callback) => listeners.delete(callback));
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: vi.fn(function (frames, options) {
    const animation = { frames, options, cancel: vi.fn(), onfinish: null }; animations.push(animation); return animation;
  }) });
});
afterEach(() => { vi.unstubAllGlobals(); delete HTMLElement.prototype.animate; });
const show = () => render(<MemoryRouter><Layout><input aria-label="正文输入" /></Layout></MemoryRouter>);

test('closing the mobile navigation immediately removes live links, releases focus, and leaves inert visuals only', () => {
  show(); fireEvent.click(screen.getByRole('button', { name: '打开导航菜单' }));
  expect(within(screen.getByRole('navigation', { name: '移动导航' })).getAllByRole('link')).toHaveLength(5);
  fireEvent.click(screen.getByRole('button', { name: '关闭导航' }));
  expect(screen.queryByRole('navigation', { name: '移动导航' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '打开导航菜单' })).toHaveFocus();
  const ghost = document.querySelector('.shell-navigation-exit');
  expect(ghost).toHaveAttribute('inert');
  expect(ghost).toHaveAttribute('aria-hidden', 'true');
  expect(ghost.querySelectorAll('[href], [tabindex="0"]')).toHaveLength(0);
  expect(animations.map(animation => animation.options.duration)).toEqual([140, 360]);
  const input = screen.getByRole('textbox', { name: '正文输入' }); input.focus();
  act(() => animations[1].onfinish());
  expect(input).toHaveFocus();
  expect(document.querySelector('.shell-navigation-exit')).toBeNull();
});

test('reopening cancels the old exit, and preference changes and unmount clean up safely', () => {
  const view = show();
  const trigger = screen.getByRole('button', { name: '打开导航菜单' });
  fireEvent.click(trigger); fireEvent.click(screen.getByRole('button', { name: '关闭导航' }));
  fireEvent.click(trigger);
  expect(document.querySelector('.shell-navigation-exit')).toBeNull();
  expect(animations.every(animation => animation.cancel.mock.calls.length)).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: '关闭导航' }));
  act(() => { media.matches = true; listeners.forEach(listener => listener({ matches: true })); });
  expect(document.querySelector('.shell-navigation-exit')).toBeNull();
  fireEvent.click(trigger); fireEvent.click(screen.getByRole('button', { name: '关闭导航' }));
  expect(animations).toHaveLength(4);
  view.unmount(); expect(listeners.size).toBe(0);
});
