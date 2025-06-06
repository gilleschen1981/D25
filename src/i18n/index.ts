import I18n from 'i18n-js';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { LocaleConfig } from '../models/types';

// 创建i18n实例
const i18n = I18n;

// 设置翻译
i18n.translations = {
  'zh-CN': zh,
  'en-US': en,
  'ja-JP': ja
};

// 默认语言
i18n.defaultLocale = 'zh-CN';
i18n.locale = 'zh-CN';

// 支持的语言配置
export const localeConfig: LocaleConfig = {
  supportedLocales: {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語'
  },
  defaultLocale: 'zh-CN',
  dateFormats: {
    short: {
      'zh-CN': 'YYYY-MM-DD',
      'en-US': 'MM/DD/YYYY',
      'ja-JP': 'YYYY/MM/DD'
    },
    long: {
      'zh-CN': 'YYYY年M月D日',
      'en-US': 'MMMM D, YYYY',
      'ja-JP': 'YYYY年M月D日'
    }
  }
};

// 切换语言
export const changeLanguage = (locale: keyof typeof localeConfig.supportedLocales) => {
  i18n.locale = locale;
};

export default i18n;
