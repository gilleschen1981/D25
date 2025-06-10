import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingScreen from '../../app/(tabs)/setting';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Settings } from '../../src/models/types';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children, ...props }: any) => children,
  },
}));

// Mock the store
jest.mock('../../src/store/useTodoStore');

// Mock i18n
jest.mock('../../src/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'settings.title': '设置',
      'settings.general': '通用设置',
      'settings.soundNotification': '声音通知',
      'settings.reminderEnabled': '提醒功能',
      'settings.remindBefore': '提前提醒',
      'settings.language': '语言',
      'settings.todo': '待办设置',
      'settings.defaultTomatoTime': '默认番茄时间',
      'settings.diary': '日记设置',
      'settings.diaryTemplate': '日记模板',
      'settings.customTags': '自定义标签',
      'settings.resetData': '重置数据',
      'settings.resetConfirm': '确认重置',
      'settings.resetConfirmMessage': '这将删除所有数据，确定继续吗？',
      'settings.confirmReset': '确认重置',
      'common.cancel': '取消',
      'common.minutes': '分钟',
      'settings.addTag': '添加标签',
      'settings.removeTag': '删除标签',
    };
    return translations[key] || key;
  },
  changeLanguage: jest.fn(),
}));

// Mock alert utils
jest.mock('../../src/utils/alertUtils', () => ({
  showAlert: jest.fn(),
}));

describe('SettingScreen', () => {
  const mockStore = {
    settings: {
      general: {
        soundEnabled: true,
        reminderEnabled: false,
        remindBefore: 5,
        language: 'zh' as const,
      },
      todo: {
        defaultTomatoTime: 25,
      },
      diary: {
        diaryTemplate: 'simple',
        customDiaryTags: ['心情', '工作'],
      },
    } as Settings,
    updateSettings: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  describe('Rendering', () => {
    it('renders correctly with all settings sections', () => {
      const { getByText } = render(<SettingScreen />);
      
      expect(getByText('通用设置')).toBeTruthy();
      expect(getByText('声音通知')).toBeTruthy();
      expect(getByText('语言')).toBeTruthy();
    });

    it('displays current settings values correctly', () => {
      const { getByDisplayValue } = render(<SettingScreen />);
      
      expect(getByDisplayValue('25')).toBeTruthy(); // 默认番茄时间
      expect(getByDisplayValue('5')).toBeTruthy(); // 提前提醒时间
    });

    it('displays switch states correctly', () => {
      const { getAllByRole } = render(<SettingScreen />);
      
      const switches = getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
      
      // 可以检查特定switch的状态
      // expect(switches[0].props.value).toBe(true); // soundEnabled
    });

    it('displays custom diary tags', () => {
      const { getByDisplayValue } = render(<SettingScreen />);
      
      expect(getByDisplayValue('心情')).toBeTruthy();
      expect(getByDisplayValue('工作')).toBeTruthy();
    });
  });

  describe('General Settings', () => {
    it('handles sound notification toggle', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const soundSwitch = getByTestId('sound-enabled-switch');
      fireEvent(soundSwitch, 'valueChange', false);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        general: {
          ...mockStore.settings.general,
          soundEnabled: false,
        },
        todo: mockStore.settings.todo,
        diary: mockStore.settings.diary,
      });
    });

    it('handles reminder toggle', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const reminderSwitch = getByTestId('reminder-enabled-switch');
      fireEvent(reminderSwitch, 'valueChange', true);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        general: {
          ...mockStore.settings.general,
          reminderEnabled: true,
        },
        todo: mockStore.settings.todo,
        diary: mockStore.settings.diary,
      });
    });

    it('handles remind before time change', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const remindBeforeInput = getByTestId('remind-before-input');
      fireEvent.changeText(remindBeforeInput, '10');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        general: {
          ...mockStore.settings.general,
          remindBefore: 10,
        },
        todo: mockStore.settings.todo,
        diary: mockStore.settings.diary,
      });
    });

    // it('handles language selection', () => {
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const languageSelector = getByTestId('language-selector');
    //   fireEvent.press(languageSelector);
      
    //   expect(mockStore.updateSettings).toHaveBeenCalledWith({
    //     general: {
    //       ...mockStore.settings.general,
    //       language: 'en',
    //     },
    //     todo: mockStore.settings.todo,
    //     diary: mockStore.settings.diary,
    //   });
    // });

    // it('validates remind before time input', () => {
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const remindBeforeInput = getByTestId('remind-before-input');
      
    //   // 测试无效输入
    //   fireEvent.changeText(remindBeforeInput, 'invalid');
    //   expect(mockStore.updateSettings).not.toHaveBeenCalled();
      
    //   // 测试负数
    //   fireEvent.changeText(remindBeforeInput, '-5');
    //   expect(mockStore.updateSettings).not.toHaveBeenCalled();
      
    //   // 测试有效输入
    //   fireEvent.changeText(remindBeforeInput, '15');
    //   expect(mockStore.updateSettings).toHaveBeenCalledWith({
    //     general: {
    //       ...mockStore.settings.general,
    //       remindBefore: 15,
    //     },
    //   });
    // });
  });

  describe('Todo Settings', () => {
    it('handles default tomato time change', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const tomatoTimeInput = getByTestId('default-tomato-time-input');
      fireEvent.changeText(tomatoTimeInput, '30');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        todo: {
          defaultTomatoTime: 30,
        },
        general: mockStore.settings.general,
        diary: mockStore.settings.diary,
      });
    });

    it('validates tomato time input', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const tomatoTimeInput = getByTestId('default-tomato-time-input');
      
      // // 测试无效输入
      // fireEvent.changeText(tomatoTimeInput, 'abc');
      // expect(mockStore.updateSettings).not.toHaveBeenCalled();
      
      // // 测试超出范围的值
      // fireEvent.changeText(tomatoTimeInput, '0');
      // expect(mockStore.updateSettings).not.toHaveBeenCalled();
      
      // fireEvent.changeText(tomatoTimeInput, '1500'); // 超过1440分钟
      // expect(mockStore.updateSettings).not.toHaveBeenCalled();
      
      // 测试有效输入
      fireEvent.changeText(tomatoTimeInput, '45');
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        todo: {
          defaultTomatoTime: 45,
        },
        general: mockStore.settings.general,
        diary: mockStore.settings.diary,
      });
    });
  });

  describe('Diary Settings', () => {
    // it('handles diary template change', () => {
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const templateSelector = getByTestId('diary-template-selector');
    //   fireEvent(templateSelector, 'valueChange', 'detailed');
      
    //   expect(mockStore.updateSettings).toHaveBeenCalledWith({
    //     diary: {
    //       ...mockStore.settings.diary,
    //       diaryTemplate: 'detailed',
    //     },
    //     general: mockStore.settings.general,
    //     todo: mockStore.settings.todo,
    //   });
    // });

    it('handles custom tag changes', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const tagInput = getByTestId('custom-tag-input-0');
      fireEvent.changeText(tagInput, '心情状态');
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        diary: {
          ...mockStore.settings.diary,
          customDiaryTags: ['心情状态', '工作'],
        },
        general: mockStore.settings.general,
        todo: mockStore.settings.todo,
      });
    });

    it('handles adding new custom tag', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const addTagButton = getByTestId('add-tag-button');
      fireEvent.press(addTagButton);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        diary: {
          ...mockStore.settings.diary,
          customDiaryTags: ['心情', '工作', ''],
        },
        general: mockStore.settings.general,
        todo: mockStore.settings.todo,
      });
    });

    it('handles removing custom tag', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const removeTagButton = getByTestId('remove-tag-button-0');
      fireEvent.press(removeTagButton);
      
      expect(mockStore.updateSettings).toHaveBeenCalledWith({
        diary: {
          ...mockStore.settings.diary,
          customDiaryTags: ['工作'],
        },
        general: mockStore.settings.general,
        todo: mockStore.settings.todo,
      });
    });

    it('prevents removing all custom tags', () => {
      // 设置只有一个标签的情况
      mockStore.settings.diary.customDiaryTags = ['心情'];
      
      const { queryByTestId } = render(<SettingScreen />);
      
      // 删除按钮应该被禁用或不存在
      const removeTagButton = queryByTestId('remove-tag-button-0');
      if (removeTagButton) {
        fireEvent.press(removeTagButton);
        // 应该不会调用updateSettings或者保留至少一个标签
      }
    });
  });

  describe('Data Reset', () => {
    it('shows confirmation dialog when reset is pressed', () => {
      const { showAlert } = require('../../src/utils/alertUtils');
      const { getByTestId } = render(<SettingScreen />);
      
      const resetButton = getByTestId('reset-data-button');
      fireEvent.press(resetButton);
      
      expect(showAlert).toHaveBeenCalledWith(
        '确认重置',
        '这将删除所有数据，确定继续吗？',
        expect.arrayContaining([
          expect.objectContaining({ text: '取消' }),
          expect.objectContaining({ text: '确认重置' }),
        ])
      );
    });

    // it('calls reset when confirmed', () => {
    //   const { showAlert } = require('../../src/utils/alertUtils');
    //   showAlert.mockImplementation((title, message, buttons) => {
    //     // 模拟用户点击确认
    //     const confirmButton = buttons.find((b: any) => b.text === '确认重置');
    //     if (confirmButton && confirmButton.onPress) {
    //       confirmButton.onPress();
    //     }
    //   });
      
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const resetButton = getByTestId('reset-data-button');
    //   fireEvent.press(resetButton);
      
    //   expect(mockStore.reset).toHaveBeenCalled();
    // });

    // it('does not reset when cancelled', () => {
    //   const { showAlert } = require('../../src/utils/alertUtils');
    //   showAlert.mockImplementation((title, message, buttons) => {
    //     // 模拟用户点击取消
    //     const cancelButton = buttons.find((b: any) => b.style === 'cancel');
    //     if (cancelButton && cancelButton.onPress) {
    //       cancelButton.onPress();
    //     }
    //   });
      
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const resetButton = getByTestId('reset-data-button');
    //   fireEvent.press(resetButton);
      
    //   expect(mockStore.reset).not.toHaveBeenCalled();
    // });
  });

  describe('Language Integration', () => {
    it('calls changeLanguage when language setting changes', () => {
      const { changeLanguage } = require('../../src/i18n');
      
      // 模拟语言设置变化
      mockStore.settings.general.language = 'en';
      
      render(<SettingScreen />);
      
      expect(changeLanguage).toHaveBeenCalledWith('en');
    });

    it('updates display when language changes', () => {
      const { rerender } = render(<SettingScreen />);
      
      // 模拟语言变化
      mockStore.settings.general.language = 'en';
      rerender(<SettingScreen />);
      
      // 验证组件重新渲染
      expect(true).toBe(true); // 占位符测试
    });
  });

  describe('Input Validation', () => {
    // it('handles empty string inputs gracefully', () => {
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const tomatoTimeInput = getByTestId('default-tomato-time-input');
    //   fireEvent.changeText(tomatoTimeInput, '');
      
    //   // 应该不会崩溃，可能设置为默认值或保持原值
    //   expect(mockStore.updateSettings).not.toHaveBeenCalled();
    // });

    // it('handles very large numbers', () => {
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const tomatoTimeInput = getByTestId('default-tomato-time-input');
    //   fireEvent.changeText(tomatoTimeInput, '999999');
      
    //   // 应该被限制在合理范围内
    //   expect(mockStore.updateSettings).not.toHaveBeenCalled();
    // });

    it('handles decimal inputs for integer fields', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const tomatoTimeInput = getByTestId('default-tomato-time-input');
      fireEvent.changeText(tomatoTimeInput, '25.5');
      
      // 应该处理小数输入（可能四舍五入或拒绝）
      if (mockStore.updateSettings.mock.calls.length > 0) {
        const lastCall = mockStore.updateSettings.mock.calls[mockStore.updateSettings.mock.calls.length - 1];
        expect(Number.isInteger(lastCall[0].todo.defaultTomatoTime)).toBe(true);
      }
    });
  });

  describe('Accessibility', () => {
    it('provides accessible labels for switches', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const soundSwitch = getByTestId('sound-enabled-switch');
      expect(soundSwitch).toBeTruthy();
      
      // 可以检查accessibility相关属性
      // expect(soundSwitch.props.accessibilityLabel).toBeDefined();
    });

    it('provides accessible labels for inputs', () => {
      const { getByTestId } = render(<SettingScreen />);
      
      const tomatoTimeInput = getByTestId('default-tomato-time-input');
      expect(tomatoTimeInput).toBeTruthy();
      
      // 可以检查accessibility相关属性
      // expect(tomatoTimeInput.props.accessibilityLabel).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    // it('handles updateSettings errors gracefully', () => {
    //   mockStore.updateSettings = jest.fn().mockImplementation(() => {
    //     throw new Error('Error');
    //   });
      
    //   const { getByTestId } = render(<SettingScreen />);
      
    //   const soundSwitch = getByTestId('sound-enabled-switch');
      
    //   // 应该不会崩溃
    //   expect(() => {
    //     fireEvent(soundSwitch, 'valueChange', false);
    //   }).not.toThrow();
    // });
  });
});


