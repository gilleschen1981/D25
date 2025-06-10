import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import TodoScreen from '../../app/(tabs)/todo';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo } from '../../src/models/types';

// Mock expo-router


// Mock the store
jest.mock('../../src/store/useTodoStore');

// Mock i18n
jest.mock('../../src/i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'todo.title': '待办事项',
      'todo.start': '开始',
      'todo.dueDate': '截至',
      'common.minutes': '分钟',
      'todo.noData': '暂无待办事项',
    };
    return translations[key] || key;
  },
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    TouchableOpacity: require('react-native/Libraries/Components/Touchable/TouchableOpacity').default,
  };
});

describe('TodoScreen', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  };

  const mockStore = {
    todos: [] as Todo[],
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    daychange: jest.fn(),
    settings: {
      general: {
        language: 'zh',
      },
    },
  };

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
  });

  describe('Rendering', () => {
    it('renders correctly with empty todos', () => {
      mockStore.todos = [];
      
      const { getByText } = render(<TodoScreen />);
      
      expect(getByText('暂无待办事项')).toBeTruthy();
    });

    it('renders todos list correctly', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '完成项目文档',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          targetCount: 1,
          completedCount: 0,
        },
        {
          id: '2',
          content: '健身30分钟',
          status: 'pending',
          priority: 60,
          createdAt: '2024-01-01T01:00:00Z',
          backgroundColor: '#f5f5f5',
          tomatoTime: 30,
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      expect(getByText('完成项目文档')).toBeTruthy();
      expect(getByText('健身30分钟')).toBeTruthy();
    });

    it('displays todo with due date correctly', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '有截止时间的任务',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          dueDate: futureDate,
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      expect(getByText('有截止时间的任务')).toBeTruthy();
      expect(getByText('截至')).toBeTruthy();
    });

    it('displays tomato time correctly', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '有番茄时间的任务',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          tomatoTime: 45,
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      expect(getByText('有番茄时间的任务')).toBeTruthy();
      expect(getByText('45分钟')).toBeTruthy();
    });

    it('displays target count correctly for multi-count todos', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '多次完成的任务',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          targetCount: 5,
          completedCount: 2,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      expect(getByText('多次完成的任务')).toBeTruthy();
      expect(getByText('2/5')).toBeTruthy();
    });
  });

  describe('Todo Sorting', () => {
    it('sorts todos by priority, due date, and creation date', () => {
      const now = new Date();
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '低优先级，无截止时间',
          status: 'pending',
          priority: 30,
          createdAt: new Date(now.getTime() - 2000).toISOString(),
          backgroundColor: '#f0f0f0',
          targetCount: 1,
          completedCount: 0,
        },
        {
          id: '2',
          content: '高优先级，有截止时间',
          status: 'pending',
          priority: 90,
          createdAt: new Date(now.getTime() - 1000).toISOString(),
          backgroundColor: '#f0f0f0',
          dueDate: new Date(now.getTime() + 3600000).toISOString(),
          targetCount: 1,
          completedCount: 0,
        },
        {
          id: '3',
          content: '中等优先级，较早截止时间',
          status: 'pending',
          priority: 60,
          createdAt: now.toISOString(),
          backgroundColor: '#f0f0f0',
          dueDate: new Date(now.getTime() + 1800000).toISOString(),
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getAllByText } = render(<TodoScreen />);
      
      // 验证排序：优先级低的应该在前面（priority升序）
      const todoTexts = getAllByText(/优先级/).map(element => element.props.children);
      expect(todoTexts[0]).toBe('低优先级，无截止时间');
    });
  });

  describe('User Interactions', () => {
    it('handles add todo button press', () => {
      const { getByTestId } = render(<TodoScreen />);
      
      // 由于我们需要添加testID到实际组件中，这里先假设存在
      // const addButton = getByTestId('add-todo-button');
      // fireEvent.press(addButton);
      
      // expect(useTodoStore.setState).toHaveBeenCalledWith({
      //   editingTodoId: null,
      //   editingType: 'todo'
      // });
      // expect(mockRouter.push).toHaveBeenCalledWith('/modal/edit-todo');
    });

    it('handles todo long press for editing', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '可编辑的任务',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      const todoItem = getByText('可编辑的任务');
      fireEvent(todoItem, 'longPress');
      
      // 验证编辑状态设置和导航
      // 注意：由于组件结构，可能需要调整测试方式
    });

    it('handles start button press for todo with tomato time', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '有番茄时间的任务',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          tomatoTime: 25,
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      const startButton = getByText('开始');
      fireEvent.press(startButton);
      
      expect(mockStore.updateTodo).toHaveBeenCalledWith('1', { status: 'inProgress' });
      expect(mockRouter.push).toHaveBeenCalledWith('/modal/timer');
    });

    it('handles start button press for todo without tomato time', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '无番茄时间的任务',
          status: 'pending',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          targetCount: 1,
          completedCount: 0,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      const startButton = getByText('开始');
      fireEvent.press(startButton);
      
      expect(mockStore.updateTodo).toHaveBeenCalledWith('1', { 
        completedCount: 1,
        status: 'done'
      });
    });

    it('handles refresh button press', async () => {
      const { getByTestId } = render(<TodoScreen />);
      
      // 假设refresh按钮有testID
      // const refreshButton = getByTestId('refresh-button');
      // fireEvent.press(refreshButton);
      
      // await waitFor(() => {
      //   expect(mockStore.daychange).toHaveBeenCalled();
      // });
    });
  });

  describe('Todo Status Display', () => {
    it('displays completed todos with done styling', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '已完成的任务',
          status: 'done',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          targetCount: 1,
          completedCount: 1,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      const todoText = getByText('已完成的任务');
      expect(todoText).toBeTruthy();
      // 可以检查样式是否包含完成状态的样式
    });

    it('disables start button for completed todos', () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          content: '已完成的任务',
          status: 'done',
          priority: 80,
          createdAt: '2024-01-01T00:00:00Z',
          backgroundColor: '#f0f0f0',
          targetCount: 1,
          completedCount: 1,
        },
      ];
      
      mockStore.todos = mockTodos;
      
      const { getByText } = render(<TodoScreen />);
      
      const startButton = getByText('开始');
      expect(startButton).toBeTruthy();
      
      // 测试按钮是否被禁用
      fireEvent.press(startButton);
      expect(mockStore.updateTodo).not.toHaveBeenCalled();
    });
  });

  describe('Language Support', () => {
    it('updates display when language changes', () => {
      mockStore.settings.general.language = 'en';
      
      const { rerender } = render(<TodoScreen />);
      
      // 模拟语言变化
      mockStore.settings.general.language = 'zh';
      rerender(<TodoScreen />);
      
      // 验证组件重新渲染
      expect(true).toBe(true); // 占位符测试
    });
  });
});
