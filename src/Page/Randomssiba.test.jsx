import { fireEvent, render, screen } from '@testing-library/react';
import Randomssiba from './Randomssiba';
import { StrictMode } from 'react';

vi.mock('../components/ResponsiveLayout', () => ({ default: ({ children }) => <>{children}</> }));
vi.mock('antd', () => ({
  Button: ({ children, loading, icon, size, type, ...props }) => <button {...props}>{children}</button>,
}));
vi.mock('@ant-design/icons', () => ({ ReloadOutlined: () => null, DownloadOutlined: () => null }));

test('GIF loads before download and reroll chooses another image', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<Randomssiba />);
  expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('图片加载中');
  const firstImage = screen.getByRole('img', { name: '随机兔子' });
  const firstSource = firstImage.getAttribute('src');
  expect(firstSource).toMatch(/\.gif(?:\?|$)/);
  fireEvent.load(firstImage);
  expect(firstImage).not.toHaveAttribute('data-image-revealing');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '下载图片' }));
  expect(download).toHaveBeenCalledOnce();
  expect(download.mock.instances[0].download).toMatch(/\.gif$/);
  vi.mocked(Math.random).mockReturnValue(0.99);
  fireEvent.click(screen.getByRole('button', { name: '换一张' }));
  expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
  const nextImage = screen.getByRole('img', { name: '随机兔子' });
  expect(nextImage.getAttribute('src')).not.toBe(firstSource);
  fireEvent.load(nextImage);
  expect(nextImage).toHaveAttribute('data-image-revealing');
  expect(screen.getByRole('button', { name: '下载图片' })).toBeEnabled();
});

test('rapid rerolls accept only the latest load and preserve control focus in StrictMode', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<StrictMode><Randomssiba /></StrictMode>);
  fireEvent.load(screen.getByRole('img', { name: '随机兔子' }));
  const reroll = screen.getByRole('button', { name: '换一张' });
  reroll.focus();
  fireEvent.click(reroll);
  const superseded = screen.getByRole('img', { name: '随机兔子' });
  fireEvent.click(reroll);
  const latest = screen.getByRole('img', { name: '随机兔子' });
  expect(latest).not.toBe(superseded);
  fireEvent.load(superseded);
  fireEvent.error(superseded);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
  expect(latest).not.toHaveAttribute('data-image-revealing');
  fireEvent.load(latest);
  expect(screen.getByRole('button', { name: '下载图片' })).toBeEnabled();
  expect(document.activeElement).toBe(reroll);
});

test('unmounting a pending reroll leaves the next mount usable', () => {
  const first = render(<Randomssiba />);
  fireEvent.click(screen.getByRole('button', { name: '换一张' }));
  const abandoned = screen.getByRole('img', { name: '随机兔子' });
  first.unmount();
  render(<Randomssiba />);
  fireEvent.load(abandoned);
  expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
  fireEvent.load(screen.getByRole('img', { name: '随机兔子' }));
  expect(screen.getByRole('button', { name: '下载图片' })).toBeEnabled();
});

test('failed media reports the failure and can be replaced', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  render(<Randomssiba />);
  fireEvent.error(screen.getByRole('img', { name: '随机兔子' }));
  expect(screen.getByRole('alert')).toHaveTextContent('图片加载失败');
  expect(screen.getByRole('button', { name: '下载图片' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '换一张' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  fireEvent.load(screen.getByRole('img', { name: '随机兔子' }));
  expect(screen.getByRole('button', { name: '下载图片' })).toBeEnabled();
});
