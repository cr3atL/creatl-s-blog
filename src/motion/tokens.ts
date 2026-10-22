export const motion = {
  duration: { fast: 140, standard: 240, slow: 360 },
  easing: {
    enter: 'cubic-bezier(.2, .7, .2, 1)',
    exit: 'cubic-bezier(.4, 0, 1, 1)',
    move: 'cubic-bezier(.42, 0, .2, 1)',
  },
  distance: { page: 8, control: 4 },
  stagger: 60,
  maxStagger: 120,
} as const;
