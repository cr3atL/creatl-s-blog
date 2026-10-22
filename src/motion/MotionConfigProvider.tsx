import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import useReducedMotion from '../hooks/useReducedMotion';
import { motion } from './tokens';

export default function MotionConfigProvider({ children, theme }: { children: ReactNode; theme?: ThemeConfig }) {
  const reducedMotion = useReducedMotion();
  const configuredTheme = useMemo<ThemeConfig>(() => ({
    ...theme,
    token: {
      ...theme?.token,
      motion: !reducedMotion,
      motionDurationFast: `${motion.duration.fast / 1000}s`,
      motionDurationMid: `${motion.duration.standard / 1000}s`,
      motionDurationSlow: `${motion.duration.slow / 1000}s`,
      motionEaseInOut: motion.easing.move,
      motionEaseOut: motion.easing.enter,
      motionEaseIn: motion.easing.exit,
      motionEaseOutBack: motion.easing.enter,
      motionEaseInBack: motion.easing.exit,
      motionEaseInOutCirc: motion.easing.move,
    },
  }), [theme, reducedMotion]);
  return <ConfigProvider theme={configuredTheme} wave={{ disabled: true }}>{children}</ConfigProvider>;
}
