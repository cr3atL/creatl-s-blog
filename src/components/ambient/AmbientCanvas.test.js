import { act, render, screen } from '@testing-library/react';
import AmbientCanvas from './AmbientCanvas';

const createMatchMedia = (matches) => ({
  matches,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

describe('AmbientCanvas', () => {
  let context;
  let matchMedia;
  let animationCallbacks;

  beforeEach(() => {
    context = {
      clearRect: jest.fn(),
      fillText: jest.fn(),
      setTransform: jest.fn(),
      set fillStyle(value) {},
      set font(value) {},
      set textAlign(value) {},
      set textBaseline(value) {},
    };
    matchMedia = createMatchMedia(false);
    animationCallbacks = [];

    window.matchMedia = jest.fn(() => matchMedia);
    window.requestAnimationFrame = jest.fn((callback) => {
      animationCallbacks.push(callback);
      return animationCallbacks.length;
    });
    window.cancelAnimationFrame = jest.fn();
    HTMLCanvasElement.prototype.getContext = jest.fn(() => context);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
  });

  test('renders an inaccessible pointer-transparent canvas and starts animation', () => {
    render(<AmbientCanvas />);

    const canvas = screen.getByTestId('ambient-canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas).toHaveClass('ambient-canvas');
    expect(window.requestAnimationFrame).toHaveBeenCalled();
    expect(context.setTransform).toHaveBeenCalled();
  });

  test('caps DPR and updates canvas dimensions on resize', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 3,
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });

    render(<AmbientCanvas />);
    const canvas = screen.getByTestId('ambient-canvas');

    expect(canvas.width).toBe(2400);
    expect(canvas.height).toBe(1600);
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 600,
    });
    act(() => window.dispatchEvent(new Event('resize')));
    act(() => animationCallbacks[animationCallbacks.length - 1]());

    expect(canvas.width).toBe(1200);
    expect(canvas.style.width).toBe('600px');
  });

  test('reduces canvas backing scale on very large viewports', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 3840,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 2160,
    });

    render(<AmbientCanvas />);
    const canvas = screen.getByTestId('ambient-canvas');

    expect(canvas.width * canvas.height).toBeLessThanOrEqual(10000000);
    expect(canvas.width).toBeLessThan(7680);
  });

  test('renders a static frame when reduced motion is requested', () => {
    matchMedia = createMatchMedia(true);
    window.matchMedia = jest.fn(() => matchMedia);

    render(<AmbientCanvas />);

    expect(context.fillText).toHaveBeenCalled();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  test('caps character detail for a 4K static frame', () => {
    matchMedia = createMatchMedia(true);
    window.matchMedia = jest.fn(() => matchMedia);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 3840,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 2160,
    });

    render(<AmbientCanvas />);

    expect(context.fillText.mock.calls.length).toBeLessThanOrEqual(1800);
  });

  test('pauses while hidden, resumes when visible, and cleans up on unmount', () => {
    const removeWindowListener = jest.spyOn(window, 'removeEventListener');
    const removeDocumentListener = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(<AmbientCanvas />);

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(removeWindowListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeDocumentListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    );
    expect(matchMedia.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
