import i18n, { changeLanguage, getCurrentLanguage, localeConfig } from '../../src/i18n';
import { Language } from '../../src/models/types';

describe('i18n', () => {
  beforeEach(() => {
    // 重置为默认语言
    i18n.locale = 'zh-CN';
  });

  describe('Default Configuration', () => {
    it('should have correct default locale', () => {
      expect(i18n.defaultLocale).toBe('zh-CN');
      expect(i18n.locale).toBe('zh-CN');
    });

    it('should have all required translations', () => {
      expect(i18n.translations).toHaveProperty('zh-CN');
      expect(i18n.translations).toHaveProperty('en-US');
      expect(i18n.translations).toHaveProperty('ja-JP');
    });

    it('should have correct locale config', () => {
      expect(localeConfig.defaultLocale).toBe('zh-CN');
      expect(localeConfig.supportedLocales).toEqual({
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語'
      });
    });
  });

  describe('Language Switching', () => {
    it('should change language to English', () => {
      changeLanguage('en');
      expect(i18n.locale).toBe('en-US');
    });

    it('should change language to Japanese', () => {
      changeLanguage('ja');
      expect(i18n.locale).toBe('ja-JP');
    });

    it('should change language to Chinese', () => {
      changeLanguage('zh');
      expect(i18n.locale).toBe('zh-CN');
    });

    it('should handle multiple language changes', () => {
      changeLanguage('en');
      expect(i18n.locale).toBe('en-US');
      
      changeLanguage('ja');
      expect(i18n.locale).toBe('ja-JP');
      
      changeLanguage('zh');
      expect(i18n.locale).toBe('zh-CN');
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current language as zh', () => {
      i18n.locale = 'zh-CN';
      expect(getCurrentLanguage()).toBe('zh');
    });

    it('should return current language as en', () => {
      i18n.locale = 'en-US';
      expect(getCurrentLanguage()).toBe('en');
    });

    it('should return current language as ja', () => {
      i18n.locale = 'ja-JP';
      expect(getCurrentLanguage()).toBe('ja');
    });

    it('should return default language for unknown locale', () => {
      i18n.locale = 'unknown-locale';
      expect(getCurrentLanguage()).toBe('zh');
    });
  });

  describe('Translation Keys', () => {
    it('should have common translation keys in all languages', () => {
      const commonKeys = ['minutes', 'hours', 'days', 'save', 'cancel', 'delete'];
      
      ['zh-CN', 'en-US', 'ja-JP'].forEach(locale => {
        const translations = i18n.translations[locale];
        expect(translations).toHaveProperty('common');
        
        commonKeys.forEach(key => {
          expect((translations as any).common).toHaveProperty(key);
          expect(typeof (translations as any).common[key]).toBe('string');
          expect((translations as any).common[key].length).toBeGreaterThan(0);
        });
      });
    });

    it('should have tabs translation keys in all languages', () => {
      const tabKeys = ['todo', 'habit', 'diary', 'setting'];
      
      ['zh-CN', 'en-US', 'ja-JP'].forEach(locale => {
        const translations = i18n.translations[locale];
        expect(translations).toHaveProperty('tabs');
        
        tabKeys.forEach(key => {
          expect((translations as any).tabs).toHaveProperty(key);
          expect(typeof (translations as any).tabs[key]).toBe('string');
          expect((translations as any).tabs[key].length).toBeGreaterThan(0);
        });
      });
    });

    it('should have todo translation keys in all languages', () => {
      const todoKeys = ['title', 'addNew', 'editTitle', 'dueDate', 'start'];
      
      ['zh-CN', 'en-US', 'ja-JP'].forEach(locale => {
        const translations = i18n.translations[locale];
        expect(translations).toHaveProperty('todo');
        
        todoKeys.forEach(key => {
          expect((translations as any).todo).toHaveProperty(key);
          expect(typeof (translations as any).todo[key]).toBe('string');
          expect((translations as any).todo[key].length).toBeGreaterThan(0);
        });
      });
    });

    it('should have habit translation keys in all languages', () => {
      const habitKeys = ['title', 'addNew', 'editTitle'];
      
      ['zh-CN', 'en-US', 'ja-JP'].forEach(locale => {
        const translations = i18n.translations[locale];
        expect(translations).toHaveProperty('habit');
        
        habitKeys.forEach(key => {
          expect((translations as any).habit).toHaveProperty(key);
          expect(typeof (translations as any).habit[key]).toBe('string');
          expect((translations as any).habit[key].length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Translation Function', () => {
    it('should translate common keys correctly in Chinese', () => {
      i18n.locale = 'zh-CN';
      expect(i18n.t('common.save')).toBe('保存');
      expect(i18n.t('common.cancel')).toBe('取消');
      expect(i18n.t('common.delete')).toBe('删除');
    });

    it('should translate tab keys correctly in Chinese', () => {
      i18n.locale = 'zh-CN';
      expect(i18n.t('tabs.todo')).toBe('待办');
      expect(i18n.t('tabs.habit')).toBe('习惯');
      expect(i18n.t('tabs.diary')).toBe('日记');
      expect(i18n.t('tabs.setting')).toBe('设置');
    });

    it('should translate keys correctly after language change', () => {
      // 开始是中文
      i18n.locale = 'zh-CN';
      expect(i18n.t('common.save')).toBe('保存');
      
      // 切换到英文
      changeLanguage('en');
      expect(i18n.t('common.save')).toBe('Save');
      
      // 切换到日文
      changeLanguage('ja');
      expect(i18n.t('common.save')).toBe('保存');
    });

    it('should handle missing translation keys gracefully', () => {
      i18n.locale = 'zh-CN';
      const result = i18n.t('nonexistent.key');
      // i18n-js 通常返回 key 本身或者 missing translation 信息
      expect(typeof result).toBe('string');
    });

    it('should handle nested translation keys', () => {
      i18n.locale = 'zh-CN';
      expect(i18n.t('habit.periods.daily')).toBeDefined();
      expect(typeof i18n.t('habit.periods.daily')).toBe('string');
    });
  });

  describe('Date Formats', () => {
    it('should have correct date formats for all locales', () => {
      expect(localeConfig.dateFormats.short).toEqual({
        'zh-CN': 'YYYY-MM-DD',
        'en-US': 'MM/DD/YYYY',
        'ja-JP': 'YYYY/MM/DD'
      });

      expect(localeConfig.dateFormats.long).toEqual({
        'zh-CN': 'YYYY年M月D日',
        'en-US': 'MMMM D, YYYY',
        'ja-JP': 'YYYY年M月D日'
      });
    });

    it('should have date formats for all supported locales', () => {
      const supportedLocales = Object.keys(localeConfig.supportedLocales);
      
      supportedLocales.forEach(locale => {
        expect(localeConfig.dateFormats.short).toHaveProperty(locale);
        expect(localeConfig.dateFormats.long).toHaveProperty(locale);
        expect(typeof (localeConfig as any).dateFormats.short[locale]).toBe('string');
        expect(typeof (localeConfig as any).dateFormats.long[locale]).toBe('string');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid language codes gracefully', () => {
      const originalLocale = i18n.locale;
      
      // 尝试设置无效的语言代码
      changeLanguage('invalid' as Language);
      
      // 应该不会抛出错误，但可能不会改变locale
      expect(typeof i18n.locale).toBe('string');
    });

    it('should maintain translation consistency', () => {
      // 检查所有语言的翻译结构是否一致
      const zhKeys = Object.keys(i18n.translations['zh-CN']);
      const enKeys = Object.keys(i18n.translations['en-US']);
      const jaKeys = Object.keys(i18n.translations['ja-JP']);
      
      expect(zhKeys.sort()).toEqual(enKeys.sort());
      expect(zhKeys.sort()).toEqual(jaKeys.sort());
    });

    it('should handle empty translation values', () => {
      // 确保没有空的翻译值
      ['zh-CN', 'en-US', 'ja-JP'].forEach(locale => {
        const translations = i18n.translations[locale];
        
        const checkTranslations = (obj: any, path = '') => {
          Object.keys(obj).forEach(key => {
            const fullPath = path ? `${path}.${key}` : key;
            const value = obj[key];
            
            if (typeof value === 'string') {
              expect(value.length).toBeGreaterThan(0);
            } else if (typeof value === 'object' && value !== null) {
              checkTranslations(value, fullPath);
            }
          });
        };
        
        checkTranslations(translations);
      });
    });
  });

  describe('Language Mapping', () => {
    it('should correctly map language codes to locales', () => {
      const expectedMappings = {
        'zh': 'zh-CN',
        'en': 'en-US',
        'ja': 'ja-JP'
      };
      
      Object.entries(expectedMappings).forEach(([lang, expectedLocale]) => {
        changeLanguage(lang as Language);
        expect(i18n.locale).toBe(expectedLocale);
      });
    });

    it('should correctly reverse map locales to language codes', () => {
      const expectedReverseMappings = {
        'zh-CN': 'zh',
        'en-US': 'en',
        'ja-JP': 'ja'
      };
      
      Object.entries(expectedReverseMappings).forEach(([locale, expectedLang]) => {
        i18n.locale = locale;
        expect(getCurrentLanguage()).toBe(expectedLang);
      });
    });
  });
});
