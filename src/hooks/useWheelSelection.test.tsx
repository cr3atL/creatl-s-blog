import { fireEvent, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import useWheelSelection from './useWheelSelection';

function Selection({ enabled = true, scope = 'root' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  useWheelSelection(ref, (direction) => setIndex(index + direction), { enabled, resetKey: scope });
  return <div ref={ref} data-testid="wheel-region">{index}</div>;
}

afterEach(() => { vi.restoreAllMocks(); });

test('mouse pixel, line and page deltas each select one item and repeated notches stay responsive', () => {
  render(<Selection />);
  const region = screen.getByTestId('wheel-region');
  for (const input of [{ deltaY: 60 }, { deltaY: 120 }, { deltaY: 3, deltaMode: 1 }, { deltaY: 1, deltaMode: 2 }]) {
    expect(fireEvent.wheel(region, input)).toBe(false);
  }
  expect(region).toHaveTextContent('4');
  fireEvent.wheel(region, { deltaY: -120 });
  expect(region).toHaveTextContent('3');
});

test('small trackpad deltas accumulate; reversal, idle gaps and directory changes discard partial gestures', () => {
  let time = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => time);
  const { rerender } = render(<Selection />);
  const region = screen.getByTestId('wheel-region');
  for (let i = 0; i < 4; i++) fireEvent.wheel(region, { deltaY: 8 });
  expect(region).toHaveTextContent('0');
  fireEvent.wheel(region, { deltaY: 8 });
  expect(region).toHaveTextContent('1');
  fireEvent.wheel(region, { deltaY: 30 });
  fireEvent.wheel(region, { deltaY: -10 });
  expect(region).toHaveTextContent('1');
  fireEvent.wheel(region, { deltaY: -30 });
  expect(region).toHaveTextContent('0');
  fireEvent.wheel(region, { deltaY: 30 });
  time = 181;
  fireEvent.wheel(region, { deltaY: 10 });
  expect(region).toHaveTextContent('0');
  rerender(<Selection scope="catalog" />);
  fireEvent.wheel(region, { deltaY: 30 });
  expect(region).toHaveTextContent('0');
});

test('zoom, horizontal gestures, disabled regions and removed listeners retain native behavior', () => {
  const { rerender, unmount } = render(<Selection />);
  const region = screen.getByTestId('wheel-region');
  for (const input of [{ deltaY: 120, ctrlKey: true }, { deltaY: 120, metaKey: true },
    { deltaY: 120, shiftKey: true }, { deltaY: 30, deltaX: 100 }, { deltaY: 0, deltaX: 100 }]) {
    expect(fireEvent.wheel(region, input)).toBe(true);
  }
  expect(region).toHaveTextContent('0');
  rerender(<Selection enabled={false} />);
  expect(fireEvent.wheel(region, { deltaY: 120 })).toBe(true);
  rerender(<Selection />);
  unmount();
  expect(fireEvent.wheel(region, { deltaY: 120 })).toBe(true);
});
