import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

const oceanCharacters = ['~', '.', '.', ':', "'", ' '];
const disturbanceCharacters = ['A', 'R', 'C', 'H', 'I', 'V', 'E'];
const maxDpr = 2;
const maxBackingPixels = 10_000_000;
const maxCharacters = 1800;

const stableCharacter = (column, row, frameBucket) => {
  const hash = Math.abs((column * 17 + row * 31 + frameBucket * 13 + column * row * 7) % 97);
  return oceanCharacters[hash % oceanCharacters.length];
};

const getCanvasDpr = (width, height) => {
  const deviceDpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const desiredPixels = width * height * deviceDpr * deviceDpr;

  if (desiredPixels <= maxBackingPixels) {
    return deviceDpr;
  }

  return Math.max(1, Math.sqrt(maxBackingPixels / (width * height)));
};

const AmbientCanvas = () => {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    let animationFrame = null;
    let resizeFrame = null;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let cellWidth = 12;
    let cellHeight = 15;
    let lastFrameTime = 0;
    let font = '12px monospace';
    let pointer = null;
    const enablePointerDisturbance =
      !reducedMotion &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const baseCellWidth = width <= 700 ? 9 : 12;
      const baseCellHeight = width <= 700 ? 12 : 15;
      const estimatedCharacters = (width / baseCellWidth) * (height / baseCellHeight);
      const scale =
        estimatedCharacters > maxCharacters
          ? Math.sqrt(estimatedCharacters / maxCharacters)
          : 1;
      cellWidth = Math.ceil(baseCellWidth * scale);
      cellHeight = Math.ceil(baseCellHeight * scale);
      while (Math.ceil(width / cellWidth) * Math.ceil(height / cellHeight) > maxCharacters) {
        cellWidth += 1;
        cellHeight += 1;
      }

      const dpr = getCanvasDpr(width, height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.ceil(width / cellWidth);
      rows = Math.ceil(height / cellHeight);
      font = `${cellHeight}px ${getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-mono')
        .trim() || 'monospace'}`;
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      context.font = font;
      context.textAlign = 'left';
      context.textBaseline = 'top';

      const frameBucket = reducedMotion ? 0 : Math.floor(time / 240);
      const waterline = Math.floor(rows * 0.63);
      const pointerAge = pointer ? time - pointer.time : Infinity;

      for (let column = 0; column < columns; column += 1) {
        const wave =
          Math.sin(column * 0.21 + time * 0.0007) +
          Math.sin(column * 0.08 - time * 0.00038) * 0.9;
        const crest = Math.max(0, Math.floor(waterline + wave * 1.8));

        for (let row = crest; row < rows; row += 1) {
          const x = column * cellWidth;
          const y = row * cellHeight;
          const isCrest = row === crest;
          const nearPointer =
            enablePointerDisturbance &&
            pointerAge < 420 &&
            Math.hypot(pointer.x - x, pointer.y - y) < 92;
          const char = nearPointer
            ? disturbanceCharacters[(column + row + frameBucket) % disturbanceCharacters.length]
            : isCrest
              ? '~'
              : stableCharacter(column, row, frameBucket);

          context.fillStyle = nearPointer
            ? 'rgba(216, 180, 95, 0.62)'
            : isCrest
              ? 'rgba(112, 203, 216, 0.36)'
              : 'rgba(241, 238, 228, 0.24)';
          context.fillText(char, x, y);
        }
      }
    };

    const animate = (time) => {
      if (time - lastFrameTime >= 50) {
        draw(time);
        lastFrameTime = time;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const startAnimation = () => {
      stopAnimation();

      if (reducedMotion || document.hidden) {
        draw();
        return;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (resizeFrame !== null) {
        return;
      }

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        resize();
        startAnimation();
      });
    };

    const handlePointerMove = (event) => {
      pointer = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
      };
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    resize();
    startAnimation();
    window.addEventListener('resize', handleResize);
    if (enablePointerDisturbance) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAnimation();
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
      window.removeEventListener('resize', handleResize);
      if (enablePointerDisturbance) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-canvas"
      aria-hidden="true"
      data-testid="ambient-canvas"
    />
  );
};

export default AmbientCanvas;
