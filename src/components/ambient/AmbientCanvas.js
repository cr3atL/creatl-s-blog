import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

const oceanCharacters = ['#', '~', '.', '.', '.', ' '];
const maxDpr = 2;
const maxCharacters = 1800;

const stableCharacter = (column, row, frameBucket) => {
  const hash = Math.abs((column * 17 + row * 31 + frameBucket * 13 + column * row * 7) % 97);
  return oceanCharacters[hash % oceanCharacters.length];
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
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let cellWidth = 12;
    let cellHeight = 15;
    let lastFrameTime = 0;
    let font = '12px monospace';

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

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
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

      const frameBucket = reducedMotion ? 0 : Math.floor(time / 220);
      const waterline = Math.floor(rows * 0.38);

      for (let column = 0; column < columns; column += 1) {
        const wave =
          Math.sin(column * 0.21 + time * 0.0007) +
          Math.sin(column * 0.08 - time * 0.00038) * 0.9;
        const crest = Math.max(0, Math.floor(waterline + wave * 2.2));

        for (let row = crest; row < rows; row += 1) {
          const char =
            row === crest ? '#' : stableCharacter(column, row, frameBucket);
          context.fillStyle =
            row === crest
              ? 'rgba(121, 201, 213, 0.56)'
              : 'rgba(146, 157, 150, 0.34)';
          context.fillText(
            char,
            column * cellWidth,
            row * cellHeight
          );
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
      resize();
      startAnimation();
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
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAnimation();
      window.removeEventListener('resize', handleResize);
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
