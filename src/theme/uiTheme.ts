import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';

const supportedThemes = ['creatl-brand', 'legacy', 'ascii-modern', 'archive-terminal'];

export const resolveUITheme = (queryTheme: string | null, configuredTheme = 'creatl-brand') => {
  if (queryTheme !== null && supportedThemes.includes(queryTheme)) {
    return queryTheme;
  }

  return supportedThemes.includes(configuredTheme) ? configuredTheme : 'creatl-brand';
};

export const creatlBrandTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#995000', colorInfo: '#995000', colorLink: '#995000',
    colorSuccess: '#596725', colorWarning: '#995000', colorError: '#ab3528',
    colorBgBase: '#fff8eb', colorBgContainer: '#fffcf5', colorBgElevated: '#fffcf5',
    colorText: '#44291b', colorTextSecondary: '#79604c', colorTextTertiary: '#79604c',
    colorBorder: '#a48b70', colorBorderSecondary: '#ddcdb5',
    borderRadius: 10, borderRadiusLG: 12, controlHeight: 40,
    fontFamily: '"Noto Sans SC", "Microsoft YaHei", "Segoe UI", sans-serif',
    boxShadow: '0 8px 28px rgba(68, 41, 27, 0.08)',
    boxShadowSecondary: '0 12px 40px rgba(68, 41, 27, 0.12)',
  },
  components: {
    Button: { primaryColor: '#44291b', colorPrimary: '#ff8a00', colorPrimaryHover: '#f79a29', colorPrimaryActive: '#ed7d00', primaryShadow: 'none', defaultShadow: 'none' },
    Input: { activeBorderColor: '#995000', hoverBorderColor: '#995000' },
    Select: { optionSelectedBg: '#ffe2b7', optionSelectedColor: '#44291b' },
    Menu: { itemSelectedBg: '#ffe2b7', itemSelectedColor: '#44291b' },
    Table: { headerBg: '#f5ecd9', rowHoverBg: '#fff1d8' },
    Tag: { defaultBg: '#f5ecd9', defaultColor: '#44291b' },
  },
};

export const archiveTerminalTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#ffffff',
    colorInfo: '#ffffff',
    colorWarning: '#ffffff',
    colorError: '#ffffff',
    colorBgBase: '#000000',
    colorBgContainer: '#000000',
    colorBgElevated: '#000000',
    colorBorder: 'rgba(255, 255, 255, 0.28)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.18)',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.64)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.42)',
    borderRadius: 0,
    borderRadiusLG: 0,
    borderRadiusSM: 0,
    boxShadow: 'none',
    boxShadowSecondary: 'none',
    controlHeight: 36,
    fontFamily:
      'Inter, "Noto Sans SC", "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      borderRadius: 0,
      defaultBg: '#000000',
      defaultBorderColor: 'rgba(255, 255, 255, 0.28)',
      defaultColor: '#ffffff',
      primaryColor: '#000000',
      primaryShadow: 'none',
    },
    Card: {
      borderRadiusLG: 0,
      colorBgContainer: '#000000',
      boxShadowTertiary: 'none',
    },
    Drawer: {
      borderRadiusLG: 0,
      colorBgElevated: '#000000',
    },
    Input: {
      borderRadius: 0,
      colorBgContainer: '#000000',
    },
    Modal: {
      borderRadiusLG: 0,
      colorBgElevated: '#000000',
    },
    Pagination: {
      borderRadius: 0,
      itemActiveBg: '#000000',
    },
    Select: {
      borderRadius: 0,
      colorBgContainer: '#000000',
      colorBgElevated: '#000000',
    },
    Table: {
      borderRadius: 0,
      colorBgContainer: '#000000',
      colorBgElevated: '#000000',
      headerBg: '#000000',
    },
    Tag: {
      borderRadiusSM: 0,
      defaultBg: '#000000',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(255, 255, 255, 0.08)',
      itemBorderRadius: 0,
    },
  },
};

export const asciiModernTheme = archiveTerminalTheme;
