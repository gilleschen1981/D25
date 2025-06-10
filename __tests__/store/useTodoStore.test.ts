import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo, Habit, HabitGroup, Diary, Settings } from '../../src/models/types';

describe('Todo Store', () => {
  beforeEach(() => {
    // 重置store状态
    useTodoStore.getState().reset();
  });

  describe('Todo Operations', () => {
    it('should add a todo', () => {
      const todoToAdd: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Test todo',
        dueDate: '2024-05-01T12:00:00Z',
        tomatoTime: 60,
        targetCount: 1,
        completedCount: 0
      };
      useTodoStore.getState().addTodo(todoToAdd);

      const todos = useTodoStore.getState().todos;
      expect(todos.length).toBe(1);
      expect(todos[0].content).toBe('Test todo');
      expect(todos[0].status).toBe('pending');
      expect(todos[0].priority).toBe(50); // 默认优先级
      expect(todos[0].id).toBeDefined();
      expect(todos[0].backgroundColor).toBeDefined();
    });

    it('should update a todo status', () => {
      // 先添加一个todo
      const todoToAdd: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Test todo',
        dueDate: '2024-05-01T12:00:00Z',
        tomatoTime: 60,
        targetCount: 1,
        completedCount: 0
      };
      useTodoStore.getState().addTodo(todoToAdd);

      // 获取todo的id
      const todoId = useTodoStore.getState().todos[0].id;

      // 更新状态
      useTodoStore.getState().updateTodo(todoId, { status: 'done' });

      // 验证状态已更新
      const updatedTodos = useTodoStore.getState().todos;
      expect(updatedTodos[0].status).toBe('done');
    });

    it('should update todo content and priority', () => {
      // 添加todo
      const todoToAdd: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Original content',
        targetCount: 1,
        completedCount: 0
      };
      useTodoStore.getState().addTodo(todoToAdd);

      const todoId = useTodoStore.getState().todos[0].id;

      // 更新内容和优先级
      useTodoStore.getState().updateTodo(todoId, {
        content: 'Updated content',
        priority: 90
      });

      const updatedTodo = useTodoStore.getState().todos[0];
      expect(updatedTodo.content).toBe('Updated content');
      expect(updatedTodo.priority).toBe(90);
    });

    it('should delete a todo', () => {
      // 添加两个todo
      const todo1: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Todo 1',
        targetCount: 1,
        completedCount: 0
      };
      const todo2: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Todo 2',
        targetCount: 1,
        completedCount: 0
      };

      useTodoStore.getState().addTodo(todo1);
      useTodoStore.getState().addTodo(todo2);

      expect(useTodoStore.getState().todos.length).toBe(2);

      // 删除第一个todo
      const todoId = useTodoStore.getState().todos[0].id;
      useTodoStore.getState().deleteTodo(todoId);

      const remainingTodos = useTodoStore.getState().todos;
      expect(remainingTodos.length).toBe(1);
      expect(remainingTodos[0].content).toBe('Todo 2');
    });

    it('should handle invalid todo updates', () => {
      // 尝试更新不存在的todo
      const initialTodos = useTodoStore.getState().todos;
      useTodoStore.getState().updateTodo('non-existent-id', { status: 'done' });

      // 状态应该保持不变
      expect(useTodoStore.getState().todos).toEqual(initialTodos);
    });
  });

  describe('Habit Group Operations', () => {
    it('should add a habit group', () => {
      const groupToAdd: Omit<HabitGroup, "id" | "habits"> = {
        name: 'Test Group',
        period: 'daily',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-01T23:59:59Z'
      };

      useTodoStore.getState().addHabitGroup(groupToAdd);

      const groups = useTodoStore.getState().habitGroups;
      expect(groups.length).toBe(1);
      expect(groups[0].name).toBe('Test Group');
      expect(groups[0].period).toBe('daily');
      expect(groups[0].habits).toEqual([]);
      expect(groups[0].id).toBeDefined();
    });

    it('should delete a habit group', () => {
      // 添加两个组
      const group1: Omit<HabitGroup, "id" | "habits"> = {
        name: 'Group 1',
        period: 'daily',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-01T23:59:59Z'
      };
      const group2: Omit<HabitGroup, "id" | "habits"> = {
        name: 'Group 2',
        period: 'weekly',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-01T23:59:59Z'
      };

      useTodoStore.getState().addHabitGroup(group1);
      useTodoStore.getState().addHabitGroup(group2);

      expect(useTodoStore.getState().habitGroups.length).toBe(2);

      // 删除第一个组
      const groupId = useTodoStore.getState().habitGroups[0].id;
      useTodoStore.getState().deleteHabitGroup(groupId);

      const remainingGroups = useTodoStore.getState().habitGroups;
      expect(remainingGroups.length).toBe(1);
      expect(remainingGroups[0].name).toBe('Group 2');
    });
  });

  describe('Habit Operations', () => {
    let groupId: string;

    beforeEach(() => {
      // 为每个测试创建一个习惯组
      const group: Omit<HabitGroup, "id" | "habits"> = {
        name: 'Test Group',
        period: 'daily'
      };
      useTodoStore.getState().addHabitGroup(group);
      groupId = useTodoStore.getState().habitGroups[0].id;
    });

    it('should add a habit to a group', () => {
      const habitToAdd: Omit<Habit, "id" | "createdAt" | "backgroundColor" | "status" | "groupId"> = {
        content: 'Test habit',
        priority: 70,
        tomatoTime: 30,
        targetCount: 5,
        completedCount: 0
      };

      useTodoStore.getState().addHabit(groupId, habitToAdd);

      const groups = useTodoStore.getState().habitGroups;
      const group = groups.find(g => g.id === groupId);

      expect(group?.habits.length).toBe(1);
      expect(group?.habits[0].content).toBe('Test habit');
      expect(group?.habits[0].priority).toBe(70);
      expect(group?.habits[0].status).toBe('pending');
      expect(group?.habits[0].groupId).toBe(groupId);
    });

    it('should update a habit', () => {
      // 先添加一个习惯
      const habitToAdd: Omit<Habit, "id" | "createdAt" | "backgroundColor" | "status" | "groupId"> = {
        content: 'Original habit',
        priority: 50,
        targetCount: 1,
        completedCount: 0
      };

      useTodoStore.getState().addHabit(groupId, habitToAdd);

      const habitId = useTodoStore.getState().habitGroups[0].habits[0].id;

      // 更新习惯
      useTodoStore.getState().updateHabit(habitId, {
        content: 'Updated habit',
        priority: 80,
        completedCount: 3
      });

      const updatedHabit = useTodoStore.getState().habitGroups[0].habits[0];
      expect(updatedHabit.content).toBe('Updated habit');
      expect(updatedHabit.priority).toBe(80);
      expect(updatedHabit.completedCount).toBe(3);
    });

    it('should delete a habit', () => {
      // 添加两个习惯
      const habit1: Omit<Habit, "id" | "createdAt" | "backgroundColor" | "status" | "groupId"> = {
        content: 'Habit 1',
        priority: 50,
        targetCount: 1,
        completedCount: 0
      };
      const habit2: Omit<Habit, "id" | "createdAt" | "backgroundColor" | "status" | "groupId"> = {
        content: 'Habit 2',
        priority: 60,
        targetCount: 1,
        completedCount: 0
      };

      useTodoStore.getState().addHabit(groupId, habit1);
      useTodoStore.getState().addHabit(groupId, habit2);

      expect(useTodoStore.getState().habitGroups[0].habits.length).toBe(2);

      // 删除第一个习惯
      const habitId = useTodoStore.getState().habitGroups[0].habits[0].id;
      useTodoStore.getState().deleteHabit(habitId);

      const remainingHabits = useTodoStore.getState().habitGroups[0].habits;
      expect(remainingHabits.length).toBe(1);
      expect(remainingHabits[0].content).toBe('Habit 2');
    });
  });

  describe('Diary Operations', () => {
    it('should set diary content', () => {
      const diaryData: Diary = {
        date: '2024-01-01',
        content: 'Today was a good day',
        ratings: { '今日评价': 4.5, '心情': 4 }
      };

      useTodoStore.getState().setDiary(diaryData);

      const diary = useTodoStore.getState().diary;
      expect(diary.date).toBe('2024-01-01');
      expect(diary.content).toBe('Today was a good day');
      expect(diary.ratings['今日评价']).toBe(4.5);
      expect(diary.ratings['心情']).toBe(4);
    });

    it('should handle empty diary content', () => {
      const diaryData: Diary = {
        date: '2024-01-01',
        content: '',
        ratings: {}
      };

      useTodoStore.getState().setDiary(diaryData);

      const diary = useTodoStore.getState().diary;
      expect(diary.content).toBe('');
      expect(diary.ratings).toEqual({});
    });
  });

  describe('Settings Operations', () => {
    it('should update general settings', () => {
      const settingsUpdate: Partial<Settings> = {
        general: {
          soundEnabled: false,
          reminderEnabled: true,
          remindBefore: 10,
          language: 'en'
        }
      };

      useTodoStore.getState().updateSettings(settingsUpdate);

      const settings = useTodoStore.getState().settings;
      expect(settings.general.soundEnabled).toBe(false);
      expect(settings.general.reminderEnabled).toBe(true);
      expect(settings.general.remindBefore).toBe(10);
      expect(settings.general.language).toBe('en');
    });

    it('should update todo settings', () => {
      const settingsUpdate: Partial<Settings> = {
        todo: {
          defaultTomatoTime: 45
        }
      };

      useTodoStore.getState().updateSettings(settingsUpdate);

      const settings = useTodoStore.getState().settings;
      expect(settings.todo.defaultTomatoTime).toBe(45);
    });

    it('should update diary settings', () => {
      const settingsUpdate: Partial<Settings> = {
        diary: {
          diaryTemplate: 'detailed',
          customDiaryTags: ['心情', '工作', '学习']
        }
      };

      useTodoStore.getState().updateSettings(settingsUpdate);

      const settings = useTodoStore.getState().settings;
      expect(settings.diary.diaryTemplate).toBe('detailed');
      expect(settings.diary.customDiaryTags).toEqual(['心情', '工作', '学习']);
    });
  });

  describe('Day Change Operations', () => {
    it('should reset completed todos and habits on day change', async () => {
      // 添加一些todos和habits
      const todo: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Test todo',
        targetCount: 1,
        completedCount: 0
      };
      useTodoStore.getState().addTodo(todo);
      useTodoStore.getState().updateTodo(useTodoStore.getState().todos[0].id, { status: 'done' });

      // 添加习惯组和习惯
      const group: Omit<HabitGroup, "id" | "habits"> = {
        name: 'Daily Group',
        period: 'daily'
      };
      useTodoStore.getState().addHabitGroup(group);
      const groupId = useTodoStore.getState().habitGroups[0].id;

      const habit: Omit<Habit, "id" | "createdAt" | "backgroundColor" | "status" | "groupId"> = {
        content: 'Test habit',
        priority: 50,
        targetCount: 1,
        completedCount: 1
      };
      useTodoStore.getState().addHabit(groupId, habit);
      useTodoStore.getState().updateHabit(useTodoStore.getState().habitGroups[0].habits[0].id, { status: 'done' });

      // 执行日期变更
      await useTodoStore.getState().daychange();

      // 验证已完成的todos被移除
      expect(useTodoStore.getState().todos.length).toBe(0);

      // 验证习惯被重置
      const updatedGroups = useTodoStore.getState().habitGroups;
      if (updatedGroups.length > 0) {
        const habits = updatedGroups[0].habits;
        habits.forEach(h => {
          expect(h.status).toBe('pending');
          expect(h.completedCount).toBe(0);
        });
      }
    });
  });

  describe('Store Reset', () => {
    it('should reset store to initial state', () => {
      // 添加一些数据
      const todo: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
        content: 'Test todo',
        targetCount: 1,
        completedCount: 0
      };
      useTodoStore.getState().addTodo(todo);

      const group: Omit<HabitGroup, "id" | "habits"> = {
        name: 'Test Group',
        period: 'daily'
      };
      useTodoStore.getState().addHabitGroup(group);

      // 重置
      useTodoStore.getState().reset();

      // 验证状态被重置
      const state = useTodoStore.getState();
      expect(state.todos).toEqual([]);
      expect(state.habitGroups).toEqual([]);
      expect(state.editingTodoId).toBe(null);
      expect(state.editingType).toBe(null);
      expect(state.editingGroupId).toBe(null);
      expect(state.settings.general.language).toBe('zh');
    });
  });
});