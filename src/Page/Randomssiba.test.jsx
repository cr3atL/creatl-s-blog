import { act, fireEvent, render, screen } from '@testing-library/react';
import Randomssiba from './Randomssiba';

vi.mock('../components/ResponsiveLayout', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('antd', () => ({
  Button: ({ children, loading, icon, size, type, ...props }) => <button {...props}>{children}</button>,
}));
vi.mock('@ant-design/icons', () => ({ ReloadOutlined: () => null, DownloadOutlined: () => null }));

test('Vite imports GIF images and preserves reroll and download', () => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  try {
    render(<Randomssiba />);
    expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
    act(() => { vi.advanceTimersByTime(300); });
    const firstImage = screen.getByRole('img', { name: '随机兔子' });
    expect(firstImage.getAttribute('src')).toMatch(/\.gif(?:\?|$)/);
    fireEvent.click(screen.getByRole('button', { name: '下载图片' }));
    expect(download).toHaveBeenCalledOnce();
    expect(download.mock.instances[0].download).toMatch(/\.gif$/);
    vi.mocked(Math.random).mockReturnValue(0.99);
    fireEvent.click(screen.getByRole('button', { name: 'REROLL 换一张' }));
    expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByRole('img', { name: '随机兔子' }).getAttribute('src')).not.toBe(firstImage.getAttribute('src'));
  } finally {
    vi.useRealTimers();
  }
});
