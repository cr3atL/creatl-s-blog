import { fireEvent, render, screen } from '@testing-library/react';
import SafeImage from './SafeImage';

test('SafeImage preserves maimai URL conversion and image props', () => {
  render(<SafeImage src="https://maimai.sega.jp/img/music/example.png" alt="曲绘" className="cover" style={{ width: 120 }} />);
  expect(screen.getByAltText('曲绘')).toHaveAttribute('src', 'https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/example');
  expect(screen.getByAltText('曲绘')).toHaveClass('cover');
});

test('SafeImage recovers from an error when its source changes', () => {
  const { rerender } = render(<SafeImage src="/first.png" alt="头像" />);
  fireEvent.error(screen.getByAltText('头像'));
  expect(screen.getByAltText('头像').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
  rerender(<SafeImage src="/second.png" alt="头像" />);
  expect(screen.getByAltText('头像')).toHaveAttribute('src', '/second.png');
  fireEvent.error(screen.getByAltText('头像'));
  expect(screen.getByAltText('头像').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
});
