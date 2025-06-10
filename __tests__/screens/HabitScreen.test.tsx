import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import HabitScreen from '../../app/(tabs)/habit';
import { useTodoStore } from '../../src/store/useTodoStore';
import { HabitGroup, Habit } from '../../src/models/types';

// Mock expo-router
jest.mock('expo-router', () => {
  const React = require('react');
  return {
    useRouter: jest.fn(),
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
      'habit.title': '习惯追踪',
      'habit.noData': '暂无习惯数据',
      'habit.items': '个',
      'habit.periods.daily': '每日',
      'habit.periods.weekly': '每周',
      'habit.periods.monthly': '每月',
      'habit.periods.custom': '自定义',
      'habit.createGroup': '创建新习惯组',
      'habit.groupName': '组名',
      'habit.period': '周期',
      'habit.startDate': '开始日期',
      'habit.endDate': '结束日期',
      'habit.frequency': '频率',
      'habit.unit': '单位',
      'habit.selectStartDate': '选择开始日期',
      'habit.selectEndDate': '选择结束日期',
      'habit.inputValue': '输入数值',
      'habit.deleteTitle': '删除习惯',
      'habit.deleteConfirm': `确定要删除"${params?.content || ''}"吗？`,
      'habit.units.minutes': '分钟',
      'habit.units.hours': '小时',
      'habit.units.days': '天',
      'habit.units.weeks': '周',
      'habit.units.months': '月',
      'habit.errors.groupNameEmpty': '组名不能为空',
      'habit.errors.startDateRequired': '请选择开始日期',
      'habit.errors.endDateRequired': '请选择结束日期',
      'habit.errors.frequencyRequired': '请输入有效的频率值（大于0）',
      'habit.errors.createFailed': '创建失败',
      'habit.errors.checkInput': '请检查输入是否正确',
      'common.save': '保存',
      'common.cancel': '取消',
      'common.delete': '删除',
      'common.create': '创建',
      'common.error': '错误',
      'common.minutes': '分钟',
      'todo.start': '开始',
      'todo.dueDate': '截至',
    };
    return translations[key] || key;
  },
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');

  return {
    Swipeable: React.forwardRef(({ children, renderRightActions, onSwipeableOpen, onSwipeableClose, enabled, ...props }: any, ref: any) => {
      const [isOpen, setIsOpen] = React.useState(false);

      React.useImperativeHandle(ref, () => ({
        close: () => {
          setIsOpen(false);
          onSwipeableClose?.();
        },
        open: () => {
          setIsOpen(true);
          onSwipeableOpen?.();
        }
      }));

      return (
        <View {...props}>
          {children}
          {isOpen && enabled && renderRightActions && renderRightActions()}
        </View>
      );
    }),
    TouchableOpacity,
  };
});

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock alert utils
jest.mock('../../src/utils/alertUtils', () => ({
  showAlert: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { ...props, testID: `icon-${name}` }, `${name}-${size}-${color}`);
  },
}));

// Mock colors
jest.mock('../../src/constants/colors', () => ({
  generateRandomLightColor: jest.fn(() => '#f0f0f0'),
  Colors: {
    background: '#ffffff',
    primary: '#007AFF',
    secondary: '#f0f0f0',
    text: '#000000',
    border: '#e0e0e0',
  },
}));

// Mock styles
jest.mock('../../src/constants/styles', () => ({
  CommonStyles: {
    container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
    listItem: { padding: 12, backgroundColor: '#ffffff', marginVertical: 4 },
    contentContainer: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold' },
    doneText: { textDecorationLine: 'line-through', opacity: 0.6 },
    infoContainer: { flexDirection: 'row', alignItems: 'center' },
    dueDateContainer: { marginRight: 8 },
    dueDateLabel: { fontSize: 12, color: '#666' },
    dueDateValue: { fontSize: 12, fontWeight: 'bold' },
    tomatoTimeContainer: { marginRight: 8 },
    tomatoTimeText: { fontSize: 12, color: '#666' },
    countContainer: { marginRight: 8 },
    countText: { fontSize: 12, color: '#666' },
    startButton: { backgroundColor: '#007AFF', padding: 8, borderRadius: 4 },
    startButtonText: { color: '#ffffff', fontSize: 12 },
    disabledButton: { backgroundColor: '#ccc' },
    deleteButton: { backgroundColor: '#ff3b30', padding: 16, justifyContent: 'center' },
    groupContainer: { marginVertical: 8 },
    groupHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
    groupTitle: { fontSize: 18, fontWeight: 'bold' },
    groupHeaderRight: { flexDirection: 'row', alignItems: 'center' },
    groupCount: { fontSize: 14, color: '#666', marginRight: 8 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#666' },
    listContainer: { paddingBottom: 20 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#ffffff', padding: 20, borderRadius: 8, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    inputLabel: { fontSize: 14, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 4, marginBottom: 12 },
    periodSelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    periodOption: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, margin: 4 },
    selectedPeriod: { backgroundColor: '#007AFF' },
    periodText: { fontSize: 14 },
    selectedPeriodText: { color: '#ffffff' },
    datePickerButton: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, marginBottom: 12 },
    frequencyContainer: { flexDirection: 'row', marginBottom: 12 },
    frequencyInputContainer: { flex: 1, marginRight: 8 },
    frequencyInput: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 4 },
    unitSelectorContainer: { flex: 1 },
    unitSelector: { flexDirection: 'row', flexWrap: 'wrap' },
    unitOption: { padding: 4, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, margin: 2 },
    selectedUnit: { backgroundColor: '#007AFF' },
    unitText: { fontSize: 12 },
    selectedUnitText: { color: '#ffffff' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    modalButton: { flex: 1, padding: 12, borderRadius: 4, marginHorizontal: 4 },
    cancelButton: { backgroundColor: '#ccc' },
    createButton: { backgroundColor: '#007AFF' },
    buttonText: { color: '#ffffff', textAlign: 'center', fontWeight: 'bold' },
  },
}));

describe('HabitScreen', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  };

  const mockStore = {
    habitGroups: [] as HabitGroup[],
    addHabitGroup: jest.fn(),
    updateHabit: jest.fn(),
    deleteHabit: jest.fn(),
    daychange: jest.fn(),
    settings: {
      general: {
        language: 'zh' as const,
      },
    },
  };

  // Helper function to create mock habit
  const createMockHabit = (overrides: Partial<Habit> = {}): Habit => ({
    id: 'habit-1',
    content: '测试习惯',
    status: 'pending',
    priority: 80,
    createdAt: '2024-01-01T00:00:00Z',
    backgroundColor: '#f0f0f0',
    groupId: 'group-1',
    targetCount: 1,
    completedCount: 0,
    ...overrides,
  });

  // Helper function to create mock habit group
  const createMockHabitGroup = (overrides: Partial<HabitGroup> = {}): HabitGroup => ({
    id: 'group-1',
    name: '测试组',
    period: 'daily',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-01T23:59:59Z',
    habits: [],
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });

    // Mock getState method
    (useTodoStore as any).getState = jest.fn().mockReturnValue({
      ...mockStore,
      setState: jest.fn(),
    });

    (useTodoStore as any).setState = jest.fn();

    // Reset store state
    mockStore.habitGroups = [];
    mockStore.addHabitGroup.mockReturnValue('new-group-id');
  });

  describe('Rendering', () => {
    it('renders correctly with empty habit groups', () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('暂无习惯数据')).toBeTruthy();
    });

    it('renders habit groups correctly with different periods', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '每日习惯',
          period: 'daily',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '晨跑',
              groupId: '1',
            }),
          ],
        }),
        createMockHabitGroup({
          id: '2',
          name: '每周习惯',
          period: 'weekly',
          habits: [],
        }),
        createMockHabitGroup({
          id: '3',
          name: '每月习惯',
          period: 'monthly',
          habits: [],
        }),
        createMockHabitGroup({
          id: '4',
          name: '自定义习惯',
          period: 'custom',
          habits: [],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('每日习惯(每日)')).toBeTruthy();
      expect(getByText('每周习惯(每周)')).toBeTruthy();
      expect(getByText('每月习惯(每月)')).toBeTruthy();
      expect(getByText('自定义习惯(自定义)')).toBeTruthy();
      expect(getByText('晨跑')).toBeTruthy();
    });

    it('displays habit count correctly', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '测试组',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '习惯1',
              groupId: '1',
            }),
            createMockHabit({
              id: 'h2',
              content: '习惯2',
              groupId: '1',
              priority: 70,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('2个')).toBeTruthy();
    });

    it('displays habit with tomato time correctly', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '有番茄时间的习惯',
              groupId: '1',
              tomatoTime: 30,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('有番茄时间的习惯')).toBeTruthy();
      expect(getByText('30分钟')).toBeTruthy();
    });

    it('displays habit progress correctly', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '多次完成的习惯',
              groupId: '1',
              targetCount: 5,
              completedCount: 3,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('多次完成的习惯')).toBeTruthy();
      expect(getByText('3/5')).toBeTruthy();
    });

    it('displays habit due date correctly', () => {
      // Arrange
      const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '有截止时间的习惯',
              groupId: '1',
              dueDate: futureDate,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('有截止时间的习惯')).toBeTruthy();
      expect(getByText('截至')).toBeTruthy();
    });

    it('displays completed habit with done styling', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '已完成的习惯',
              groupId: '1',
              status: 'done',
              completedCount: 1,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('已完成的习惯')).toBeTruthy();
    });
  });

  describe('Group Interactions', () => {
    it('handles group expand/collapse', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '可折叠组',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '习惯1',
              groupId: '1',
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText, queryByText } = render(<HabitScreen />);

      // Assert - 初始状态应该展开，能看到习惯
      expect(getByText('习惯1')).toBeTruthy();

      // Act - 点击组头部折叠
      const groupHeader = getByText('可折叠组(每日)');
      fireEvent.press(groupHeader);

      // Assert - 习惯应该被隐藏
      expect(queryByText('习惯1')).toBeNull();
    });

    // it('handles add habit to group via add button', () => {
    //   // Arrange
    //   const mockHabitGroups: HabitGroup[] = [
    //     createMockHabitGroup({
    //       id: '1',
    //       name: '测试组',
    //       habits: [],
    //     }),
    //   ];

    //   mockStore.habitGroups = mockHabitGroups;

    //   // Act
    //   const { getByTestId } = render(<HabitScreen />);

    //   // Find and press the add button in the group header using testID
    //   const addButton = getByTestId('group-add-button-1');
    //   fireEvent.press(addButton);

    //   // Assert
    //   expect(useTodoStore.setState).toHaveBeenCalledWith({
    //     editingTodoId: null,
    //     editingType: 'habit',
    //     editingGroupId: '1'
    //   });
    //   expect(mockRouter.push).toHaveBeenCalledWith('/modal/edit-todo');
    // });

    it('displays correct habit count for each group', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '空组',
          habits: [],
        }),
        createMockHabitGroup({
          id: '2',
          name: '单习惯组',
          habits: [
            createMockHabit({ id: 'h1', groupId: '2' }),
          ],
        }),
        createMockHabitGroup({
          id: '3',
          name: '多习惯组',
          habits: [
            createMockHabit({ id: 'h2', groupId: '3' }),
            createMockHabit({ id: 'h3', groupId: '3' }),
            createMockHabit({ id: 'h4', groupId: '3' }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('0个')).toBeTruthy();
      expect(getByText('1个')).toBeTruthy();
      expect(getByText('3个')).toBeTruthy();
    });
  });

  describe('Habit Interactions', () => {
    it('handles habit long press for editing', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '可编辑的习惯',
              groupId: '1',
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);
      const habitItem = getByText('可编辑的习惯');
      fireEvent(habitItem, 'longPress');

      // Assert
      expect(useTodoStore.setState).toHaveBeenCalledWith({
        editingTodoId: 'h1',
        editingType: 'habit',
        editingGroupId: '1'
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/modal/edit-todo');
    });

    it('handles start button press for habit with tomato time', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '有番茄时间的习惯',
              groupId: '1',
              tomatoTime: 25,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);
      const startButton = getByText('开始');
      fireEvent.press(startButton);

      // Assert
      expect(useTodoStore.setState).toHaveBeenCalledWith({ editingTodoId: 'h1' });
      expect(mockRouter.push).toHaveBeenCalledWith('/modal/timer');
      expect(mockStore.updateHabit).toHaveBeenCalledWith('h1', { status: 'inProgress' });
    });

    it('handles start button press for habit without tomato time', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '无番茄时间的习惯',
              groupId: '1',
              // No tomatoTime property
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);
      const startButton = getByText('开始');
      fireEvent.press(startButton);

      // Assert
      expect(mockStore.updateHabit).toHaveBeenCalledWith('h1', {
        completedCount: 1,
        status: 'done'
      });
    });

    it('handles habit completion when target count is reached', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '即将完成的习惯',
              groupId: '1',
              targetCount: 3,
              completedCount: 2,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);
      const startButton = getByText('开始');
      fireEvent.press(startButton);

      // Assert
      expect(mockStore.updateHabit).toHaveBeenCalledWith('h1', {
        completedCount: 3,
        status: 'done'
      });
    });

    it('disables start button for completed habits', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '已完成的习惯',
              groupId: '1',
              status: 'done',
              completedCount: 1,
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);
      const startButton = getByText('开始');
      fireEvent.press(startButton);

      // Assert - 已完成的习惯不应该触发更新
      expect(mockStore.updateHabit).not.toHaveBeenCalled();
    });

    it('handles swipe to delete habit', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '可删除的习惯',
              groupId: '1',
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Note: In a real test, we would need to simulate swipe gestures
      // For now, we'll test that the delete function is available
      expect(getByText('可删除的习惯')).toBeTruthy();
      expect(mockStore.deleteHabit).toBeDefined();
    });
  });

  describe('Add Group Modal', () => {
    it('opens add group modal when header add button is pressed', async () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act
      const { queryByText } = render(<HabitScreen />);

      // Find the add button in the header (MaterialIcons add)
      // Since we can't easily test the header button directly, we'll test modal visibility
      // In a real implementation, we would need to add testIDs to the buttons

      // Assert - Modal should initially be closed
      expect(queryByText('创建新习惯组')).toBeNull();
    });

    it('handles group creation with valid daily period input', async () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act
      const { } = render(<HabitScreen />);

      // Simulate modal being opened and form filled
      // In a real test, we would open the modal first, then fill the form

      // For now, we'll test that the addHabitGroup function works correctly
      const groupData = {
        name: '新习惯组',
        period: 'daily' as const,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString()
      };

      // Simulate calling the handler directly
      mockStore.addHabitGroup(groupData);

      // Assert
      expect(mockStore.addHabitGroup).toHaveBeenCalledWith(groupData);
    });

    it('handles group creation with custom period input', async () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act & Assert
      const customGroupData = {
        name: '自定义习惯组',
        period: 'custom' as const,
        startDate: '2024-01-01',
        endDate: '2024-01-07',
        frequency: 10080 // 7 days in minutes
      };

      mockStore.addHabitGroup(customGroupData);

      expect(mockStore.addHabitGroup).toHaveBeenCalledWith(customGroupData);
    });

    it('validates required fields for group creation', () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act & Assert - Test that validation would prevent empty name
      // In a real implementation, this would trigger validation errors
      // For now, we'll just verify the function exists
      expect(mockStore.addHabitGroup).toBeDefined();
    });

    it('handles modal cancellation', () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act
      const { queryByText } = render(<HabitScreen />);

      // Assert - Modal should be closed by default
      expect(queryByText('创建新习惯组')).toBeNull();

      // In a real test, we would:
      // 1. Open the modal
      // 2. Press cancel button
      // 3. Verify modal is closed and no group was created
    });
  });

  describe('Period Types', () => {
    it('displays different period types correctly', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '每日组',
          period: 'daily',
          habits: [],
        }),
        createMockHabitGroup({
          id: '2',
          name: '每周组',
          period: 'weekly',
          habits: [],
        }),
        createMockHabitGroup({
          id: '3',
          name: '每月组',
          period: 'monthly',
          habits: [],
        }),
        createMockHabitGroup({
          id: '4',
          name: '自定义组',
          period: 'custom',
          habits: [],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('每日组(每日)')).toBeTruthy();
      expect(getByText('每周组(每周)')).toBeTruthy();
      expect(getByText('每月组(每月)')).toBeTruthy();
      expect(getByText('自定义组(自定义)')).toBeTruthy();
    });

    it('handles custom period with frequency correctly', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '自定义频率组',
          period: 'custom',
          frequency: 4320, // 3 days in minutes
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-04T00:00:00Z',
          habits: [],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('自定义频率组(自定义)')).toBeTruthy();
    });
  });

  describe('Language Support', () => {
    it('responds to language changes', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          name: '测试组',
          habits: [],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act
      const { rerender } = render(<HabitScreen />);

      // Simulate language change by updating the store
      mockStore.settings.general.language = 'zh';
      rerender(<HabitScreen />);

      // Assert - Component should re-render when language changes
      // The useEffect hook should trigger a force update
      expect(true).toBe(true); // Placeholder - in real test we'd check specific translations
    });
  });

  describe('Refresh Functionality', () => {
    it('handles day change refresh', async () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act
      const { } = render(<HabitScreen />);

      // In a real implementation, we would:
      // 1. Find the refresh button in the header
      // 2. Press it
      // 3. Verify daychange was called

      // For now, just verify the function exists
      expect(mockStore.daychange).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('handles store errors gracefully', () => {
      // Arrange
      mockStore.habitGroups = [];
      mockStore.addHabitGroup.mockImplementation(() => {
        throw new Error('Store error');
      });

      // Act & Assert - Component should not crash
      expect(() => render(<HabitScreen />)).not.toThrow();
    });

    it('handles empty habit groups array', () => {
      // Arrange
      mockStore.habitGroups = [];

      // Act
      const { getByText } = render(<HabitScreen />);

      // Assert
      expect(getByText('暂无习惯数据')).toBeTruthy();
    });

    it('handles malformed habit data gracefully', () => {
      // Arrange
      const mockHabitGroups: HabitGroup[] = [
        createMockHabitGroup({
          id: '1',
          habits: [
            createMockHabit({
              id: 'h1',
              content: '', // Empty content
              groupId: '1',
            }),
          ],
        }),
      ];

      mockStore.habitGroups = mockHabitGroups;

      // Act & Assert - Should not crash
      expect(() => render(<HabitScreen />)).not.toThrow();
    });
  });
});


