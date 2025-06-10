import I18n from 'i18n-js';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { LocaleConfig, Language } from '../models/types';

// 创建i18n实例
const i18n = I18n;

// 设置翻译
i18n.translations = {
  'zh-CN': zh,
  'en-US': en,
  'ja-JP': ja
};

// 语言映射
const languageMap: Record<Language, string> = {
  'zh': 'zh-CN',
  'en': 'en-US',
  'ja': 'ja-JP'
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
export const changeLanguage = (language: Language) => {
  const locale = languageMap[language];
  if (locale != null) {
    i18n.locale = locale;
  }
};

// 获取当前语言
export const getCurrentLanguage = (): Language => {
  const currentLocale = i18n.locale;
  for (const [lang, locale] of Object.entries(languageMap)) {
    if (locale === currentLocale) {
      return lang as Language;
    }
  }
  return 'zh'; // 默认返回中文
};

export default i18n;
