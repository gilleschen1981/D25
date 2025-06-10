import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DiaryScreen from '../../app/(tabs)/diary';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Diary } from '../../src/models/types';

// Mock expo-router
jest.mock('expo-router', () => {
  const React = require('react');
  return {
    Stack: {
      Screen: ({ children, options, ...props }: any) => React.createElement('View', props, children),
    },
  };
});

// Mock the store
jest.mock('../../src/store/useTodoStore');

// Mock i18n with comprehensive translations
jest.mock('../../src/i18n', () => ({
  t: (key: string, params?: any) => {
    const translations: Record<string, string> = {
      'diary.title': '日记',
      'diary.placeholder': '今天的日记...',
      'diary.todayRating': '今日评价',
      'diary.lastSaved': '上次保存',
      'diary.notSaved': '未保存',
      'diary.saveSuccess': '日记已保存',
      'diary.saveFailed': '保存失败',
      'diary.checkContent': '请检查输入内容是否正确',
      'common.save': '保存',
      'common.success': '成功',
      'common.error': '错误',
    };
    return translations[key] || key;
  },
}));

// Mock StarRating component
jest.mock('../../src/components/StarRating', () => {
  return function MockStarRating({ rating, onRatingChange, testID, maxStars }: any) {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');

    return React.createElement(
      TouchableOpacity,
      {
        testID: testID || 'star-rating',
        onPress: () => onRatingChange && onRatingChange(rating < (maxStars || 5) ? rating + 1 : rating)
      },
      React.createElement(Text, {}, `Rating: ${rating}/${maxStars || 5}`)
    );
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { ...props, testID: `icon-${name}` }, `${name}-${size}-${color}`);
  },
}));

// Mock utils
jest.mock('../../src/utils/alertUtils', () => ({
  showAlert: jest.fn(),
}));

jest.mock('../../src/utils/diaryUtils', () => ({
  generateDiaryTemplate: jest.fn().mockReturnValue({
    content: '模板内容',
    ratings: { '今日评价': 0 }
  }),
}));

// Mock styles
jest.mock('../../src/constants/styles', () => ({
  CommonStyles: {
    container: { flex: 1, backgroundColor: '#F5F5DC', padding: 16 },
    card: { backgroundColor: '#ffffff', padding: 16, marginVertical: 8, borderRadius: 8 },
    diaryCard: { minHeight: 200 },
    diaryInput: {
      fontSize: 16,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 12,
      borderRadius: 4,
      minHeight: 150
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    ratingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee'
    },
    ratingLabel: { fontSize: 16, color: '#555', flex: 1 },
    ratingControls: { flexDirection: 'row', alignItems: 'center' },
    ratingValue: {
      marginLeft: 8,
      width: 40,
      textAlign: 'center',
      fontSize: 16,
      padding: 4,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4
    },
    lastSavedText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 20
    },
  },
}));

describe('DiaryScreen', () => {
  const mockStore = {
    diary: {
      date: '2024-01-15',
      content: '',
      ratings: {},
      weather: undefined,
    } as Diary,
    setDiary: jest.fn(),
    lastSaved: null as string | null,
    settings: {
      diary: {
        diaryTemplate: 'simple',
        customDiaryTags: ['心情', '工作'],
      },
      general: {
        language: 'zh' as const,
        soundEnabled: true,
        reminderEnabled: false,
        remindBefore: 5,
      },
    },
  };

  // Helper function to create mock diary
  const createMockDiary = (overrides: Partial<Diary> = {}): Diary => ({
    date: '2024-01-15',
    content: '',
    ratings: {},
    weather: undefined,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });

    // Reset store state
    mockStore.diary = createMockDiary();
    mockStore.lastSaved = null;
    mockStore.setDiary.mockClear();
  });

  describe('Rendering', () => {
    it('renders correctly with empty diary', () => {
      // Arrange
      mockStore.diary = createMockDiary();

      // Act
      const { getByText, getByPlaceholderText, getAllByText } = render(<DiaryScreen />);

      // Assert
      expect(getAllByText('今日评价').length).toBeGreaterThan(0);
      expect(getByPlaceholderText('今天的日记...')).toBeTruthy();
    });

    it('renders diary with existing content', () => {
      // Arrange
      mockStore.diary = createMockDiary({
        content: '今天是美好的一天',
        ratings: { '今日评价': 4.5 },
      });

      // Act
      const { getByDisplayValue } = render(<DiaryScreen />);

      // Assert
      expect(getByDisplayValue('今天是美好的一天')).toBeTruthy();
    });

    it('displays default rating section', () => {
      // Arrange
      mockStore.diary = createMockDiary({
        content: '测试内容',
        ratings: { '今日评价': 4 },
      });

      // Act
      const { getByText, getAllByText } = render(<DiaryScreen />);

      // Assert
      expect(getAllByText('今日评价').length).toBeGreaterThan(0);
    });

    it('displays custom diary tags from settings', () => {
      // Arrange
      mockStore.settings.diary.customDiaryTags = ['心情', '工作效率', '健康状况'];
      mockStore.diary = createMockDiary({
        content: '测试内容',
        ratings: {
          '今日评价': 3,
          '心情': 4,
          '工作效率': 3.5,
          '健康状况': 4.5
        },
      });

      // Act
      const { getByTestId, getAllByText } = render(<DiaryScreen />);

      // Assert
      // Use getAllByText to get all elements with the text and check the count
      expect(getAllByText('今日评价').length).toBeGreaterThan(0);
      // Use testID to check for specific rating inputs
      expect(getByTestId('rating-input-心情')).toBeTruthy();
      expect(getByTestId('rating-input-工作效率')).toBeTruthy();
      expect(getByTestId('rating-input-健康状况')).toBeTruthy();
    });

    it('displays last saved time when available', () => {
      // Arrange
      mockStore.lastSaved = '2024-01-15T10:30:00Z';

      // Act
      const { getByText } = render(<DiaryScreen />);

      // Assert
      expect(getByText(/上次保存/)).toBeTruthy();
    });

    it('displays not saved message when no last saved time', () => {
      // Arrange
      mockStore.lastSaved = null;

      // Act
      const { getByText } = render(<DiaryScreen />);

      // Assert
      expect(getByText(/未保存/)).toBeTruthy();
    });

    it('handles empty custom tags gracefully', () => {
      // Arrange
      mockStore.settings.diary.customDiaryTags = [];
      mockStore.diary = createMockDiary({
        content: '测试内容',
        ratings: { '今日评价': 3 },
      });

      // Act
      const { getByText, queryByText, getAllByText } = render(<DiaryScreen />);

      // Assert
      expect(getAllByText('今日评价').length).toBeGreaterThan(0);
      expect(queryByText('心情')).toBeNull();
      expect(queryByText('工作')).toBeNull();
    });
  });

  describe('Content Editing', () => {
    it('handles content change correctly', () => {
      // Arrange
      mockStore.diary = createMockDiary({ content: '' });

      // Act
      const { getByPlaceholderText } = render(<DiaryScreen />);
      const contentInput = getByPlaceholderText('今天的日记...');
      fireEvent.changeText(contentInput, '新的日记内容');

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: '新的日记内容'
      });
    });

    it('handles empty content input', () => {
      // Arrange
      mockStore.diary = createMockDiary({ content: '原有内容' });

      // Act
      const { getByDisplayValue } = render(<DiaryScreen />);
      const contentInput = getByDisplayValue('原有内容');
      fireEvent.changeText(contentInput, '');

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: ''
      });
    });

    it('handles long content input', () => {
      // Arrange
      const longContent = 'A'.repeat(1000);
      mockStore.diary = createMockDiary({ content: '' });

      // Act
      const { getByPlaceholderText } = render(<DiaryScreen />);
      const contentInput = getByPlaceholderText('今天的日记...');
      fireEvent.changeText(contentInput, longContent);

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: longContent
      });
    });

    it('handles special characters in content', () => {
      // Arrange
      const specialContent = '今天的心情😊\n换行测试\t制表符测试';
      mockStore.diary = createMockDiary({ content: '' });

      // Act
      const { getByPlaceholderText } = render(<DiaryScreen />);
      const contentInput = getByPlaceholderText('今天的日记...');
      fireEvent.changeText(contentInput, specialContent);

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: specialContent
      });
    });
  });

  describe('Rating Interactions', () => {
    beforeEach(() => {
      mockStore.diary = createMockDiary({
        content: '测试内容',
        ratings: {
          '今日评价': 3,
          '心情': 2
        },
      });
    });

    it('handles star rating change for default rating', () => {
      // Arrange
      const { getAllByTestId } = render(<DiaryScreen />);

      // Act
      const starRatings = getAllByTestId('star-rating');
      expect(starRatings.length).toBeGreaterThan(0);
      fireEvent.press(starRatings[0]);

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: '测试内容',
        ratings: {
          ...mockStore.diary.ratings,
          '今日评价': 4
        }
      });
    });

    it('handles star rating change for custom tags', () => {
      // Arrange
      mockStore.settings.diary.customDiaryTags = ['心情'];
      const { getAllByTestId } = render(<DiaryScreen />);

      // Act
      const starRatings = getAllByTestId('star-rating');
      expect(starRatings.length).toBeGreaterThanOrEqual(2); // 今日评价 + 心情
      fireEvent.press(starRatings[1]); // 第二个应该是心情

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: '测试内容',
        ratings: {
          ...mockStore.diary.ratings,
          '心情': 3
        }
      });
    });

    it('handles rating value input change', () => {
      // Arrange
      const { getByDisplayValue } = render(<DiaryScreen />);

      // Act
      const ratingInput = getByDisplayValue('3.0'); // 今日评价的输入框
      fireEvent.changeText(ratingInput, '4.5');

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith({
        ...mockStore.diary,
        content: '测试内容',
        ratings: {
          ...mockStore.diary.ratings,
          '今日评价': 4.5
        }
      });
    });

    it('handles invalid rating input gracefully', () => {
      // Arrange
      const { getByDisplayValue } = render(<DiaryScreen />);

      // Act
      const ratingInput = getByDisplayValue('3.0');
      fireEvent.changeText(ratingInput, 'invalid');

      // Assert - 应该不调用setDiary，因为输入无效
      expect(mockStore.setDiary).not.toHaveBeenCalled();
    });

    it('handles rating input out of valid range', () => {
      // Arrange
      const { getByDisplayValue } = render(<DiaryScreen />);

      // Act
      const ratingInput = getByDisplayValue('3.0');
      fireEvent.changeText(ratingInput, '6'); // 超出0-5范围

      // Assert - 应该不调用setDiary，因为超出范围
      expect(mockStore.setDiary).not.toHaveBeenCalled();
    });

    it('handles negative rating input', () => {
      // Arrange
      const { getByDisplayValue } = render(<DiaryScreen />);

      // Act
      const ratingInput = getByDisplayValue('3.0');
      fireEvent.changeText(ratingInput, '-1');

      // Assert - 应该不调用setDiary，因为负数无效
      expect(mockStore.setDiary).not.toHaveBeenCalled();
    });

    // it('handles maximum rating correctly', () => {
    //   // Arrange
    //   const { getAllByTestId } = render(<DiaryScreen />);

    //   // Act - 连续点击星星评分到最大值
    //   const starRatings = getAllByTestId('star-rating');
    //   fireEvent.press(starRatings[0]); // 3 -> 4
    //   fireEvent.press(starRatings[0]); // 4 -> 5
    //   fireEvent.press(starRatings[0]); // 应该保持在5，不超过最大值

    //   // Assert - 最后一次调用应该是5分
    //   const lastCall = mockStore.setDiary.mock.calls[mockStore.setDiary.mock.calls.length - 1];
    //   expect(lastCall[0].ratings['今日评价']).toBe(5);
    // });
  });

  describe('Template Initialization', () => {
    // it('initializes diary with template when content is empty', () => {
    //   // Arrange
    //   mockStore.diary = createMockDiary({ content: '' });
    //   const { generateDiaryTemplate } = require('../../src/utils/diaryUtils');

    //   // Act
    //   render(<DiaryScreen />);

    //   // Assert
    //   expect(generateDiaryTemplate).toHaveBeenCalledWith(
    //     'simple',
    //     expect.any(String),
    //     undefined,
    //     ['心情', '工作']
    //   );
    // });

    it('does not reinitialize when content exists', () => {
      // Arrange
      mockStore.diary = createMockDiary({
        content: '已有内容',
        ratings: { '今日评价': 3 },
      });
      const { generateDiaryTemplate } = require('../../src/utils/diaryUtils');

      // Act
      render(<DiaryScreen />);

      // Assert - 不应该调用模板生成，因为已有内容
      expect(generateDiaryTemplate).not.toHaveBeenCalled();
    });

    it('merges template ratings with existing ratings', () => {
      // Arrange
      mockStore.diary = createMockDiary({
        content: '',
        ratings: { '心情': 4 } // 已有评分
      });
      const { generateDiaryTemplate } = require('../../src/utils/diaryUtils');
      generateDiaryTemplate.mockReturnValue({
        content: '模板内容',
        ratings: { '今日评价': 0, '工作': 0 }
      });

      // Act
      render(<DiaryScreen />);

      // Assert
      expect(mockStore.setDiary).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '模板内容',
          ratings: expect.objectContaining({
            '心情': 4, // 保留原有评分
            '今日评价': 0, // 新增模板评分
            '工作': 0
          })
        })
      );
    });
  });

  describe('Auto-save Functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('auto-saves content after typing with debounce', async () => {
      // Arrange
      mockStore.diary = createMockDiary({ content: '' });

      // Act
      const { getByPlaceholderText } = render(<DiaryScreen />);
      const contentInput = getByPlaceholderText('今天的日记...');
      fireEvent.changeText(contentInput, '自动保存测试');

      // Fast-forward time to trigger auto-save
      jest.advanceTimersByTime(2000);

      // Assert
      await waitFor(() => {
        expect(mockStore.setDiary).toHaveBeenCalledWith({
          ...mockStore.diary,
          content: '自动保存测试'
        });
      });
    });

    it('auto-saves ratings after change with debounce', async () => {
      // Arrange
      mockStore.diary = createMockDiary({
        content: '测试',
        ratings: { '今日评价': 3 },
      });

      // Act
      const { getAllByTestId } = render(<DiaryScreen />);
      const starRatings = getAllByTestId('star-rating');
      expect(starRatings.length).toBeGreaterThan(0);
      fireEvent.press(starRatings[0]);

      // Fast-forward time to trigger auto-save
      jest.advanceTimersByTime(2000);

      // Assert
      await waitFor(() => {
        expect(mockStore.setDiary).toHaveBeenCalled();
      });
    });

    it('debounces multiple rapid content changes', async () => {
      // Arrange
      mockStore.diary = createMockDiary({ content: '' });

      // Act
      const { getByPlaceholderText } = render(<DiaryScreen />);
      const contentInput = getByPlaceholderText('今天的日记...');

      // Rapid typing simulation
      fireEvent.changeText(contentInput, '第一次');
      fireEvent.changeText(contentInput, '第二次');
      fireEvent.changeText(contentInput, '第三次');

      // Fast-forward time
      jest.advanceTimersByTime(2000);

      // Assert - 应该只保存最后一次的内容
      await waitFor(() => {
        expect(mockStore.setDiary).toHaveBeenLastCalledWith({
          ...mockStore.diary,
          content: '第三次'
        });
      });
    });

    it('does not auto-save on initial render', () => {
      // Arrange
      mockStore.diary = createMockDiary({ content: '初始内容' });

      // Act
      render(<DiaryScreen />);
      jest.advanceTimersByTime(2000);

      // Assert - 初始渲染不应该触发自动保存
      expect(mockStore.setDiary).not.toHaveBeenCalled();
    });
  });

});




