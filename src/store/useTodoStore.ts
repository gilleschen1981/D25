import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { AppStateProps, AppState, Todo, Habit, Diary, Settings, HabitPeriod, HabitGroup, TodoStatus } from '../models/types';
import { todoSchema, habitSchema, diarySchema, habitGroupSchema } from '../models/schemas';
import { mockHabitGroups } from '../utils/mockHabits';
import { generateRandomLightColor } from '../constants/colors';

const initialState: AppStateProps = {
  todos: [],
  habitGroups: [],
  diary: {
    date: new Date().toISOString().split('T')[0],
    content: '',
    ratings: {}
  },
  settings: {
    general: {
      soundEnabled: true,
      reminderEnabled: false,
      remindBefore: 5,
      language: 'zh' as const
    },
    todo: {
      defaultTomatoTime: 25
    },
    diary: {
      diaryTemplate: 'simple',
      customDiaryTags: []
    }
  },
  editingTodoId: null,
  editingType: null,
  editingGroupId: null,
};

export const useTodoStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => set({ ...initialState, lastSaved: new Date().toISOString() }),
      // Todo actions
      addTodo: (todo: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority">) => {
        try {
          const newTodo: Todo = {
            ...todo,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            priority: 50,
            backgroundColor: generateRandomLightColor(),
            targetCount: todo.targetCount || 1,
            completedCount: todo.completedCount || 0
          };
          todoSchema.validateSync(newTodo);
          set((state) => ({ 
            todos: [...state.todos, newTodo],
            lastSaved: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Validation error:', error);
        }
      },

      updateTodo: (id: string, updates: Partial<Todo>) => {
        try {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            ),
            lastSaved: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Update error:', error);
        }
      },

      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
          lastSaved: new Date().toISOString()
        }));
      },

      reorderTodos: (newOrder: Todo[]) => {
        // Validate the new order contains all todos
        const currentIds = get().todos.map((t) => t.id);
        const newIds = newOrder.map((t) => t.id);
        
        if (currentIds.sort().join() !== newIds.sort().join()) {
          console.error('Invalid reorder operation');
          return;
        }

        set({ 
          todos: newOrder,
          lastSaved: new Date().toISOString()
        });
      },

      // HabitGroup actions
      addHabitGroup: (group: Omit<HabitGroup, "id" | "habits">) => {
        try {
          const id = uuidv4();
          const newGroup: HabitGroup = {
            ...group,
            id,
            habits: []
          };
          habitGroupSchema.validateSync(newGroup);
          set((state) => (
            { habitGroups: [...state.habitGroups, newGroup],
              lastSaved: new Date().toISOString()
            }));
          return id;
        } catch (error) {
          console.error('Validation error:', error);
          return '';
        }
      },

      updateHabitGroup: (id: string, updates: Partial<Omit<HabitGroup, "habits">>) => {
        try {
          set((state) => ({
            habitGroups: state.habitGroups.map((group) =>
              group.id === id ? { ...group, ...updates } : group
            ),  
            lastSaved: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Update error:', error);
        }
      },

      deleteHabitGroup: (id: string) => {
        set((state) => ({
          habitGroups: state.habitGroups.filter((group) => group.id !== id),
          lastSaved: new Date().toISOString()
        }));
      },

      // Habit actions
      addHabit: (groupId: string, habit: Omit<Habit, "id" | "createdAt" | "backgroundColor"| "status" | "groupId">) => {
        try {
          const newHabit: Habit = {
            ...habit,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            priority: habit.priority || 50,
            groupId,
            targetCount: habit.targetCount || 1,
            completedCount: 0,
            backgroundColor: generateRandomLightColor(),
            
          };
          habitSchema.validateSync(newHabit);
          
          set((state) => ({
            habitGroups: state.habitGroups.map((group) => {
              if (group.id === groupId) {
                return {
                  ...group,
                  habits: [...group.habits, newHabit]
                };
              }
              return group;
            }),
            lastSaved: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Validation error:', error);
        }
      },

      updateHabit: (id: string, updates: Partial<Habit>) => {
        try {
          set((state) => ({
            habitGroups: state.habitGroups.map((group) => {
              const habitIndex = group.habits.findIndex(h => h.id === id);
              if (habitIndex >= 0) {
                const updatedHabits = [...group.habits];
                updatedHabits[habitIndex] = { ...updatedHabits[habitIndex], ...updates };
                return { ...group, habits: updatedHabits };
              }
              return group;
            }),
            lastSaved: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Update error:', error);
        }
      },

      deleteHabit: (id: string) => {
        set((state) => ({
          habitGroups: state.habitGroups.map((group) => {
            const habitIndex = group.habits.findIndex(h => h.id === id);
            if (habitIndex >= 0) {
              const updatedHabits = group.habits.filter(h => h.id !== id);
              return { ...group, habits: updatedHabits };
            }
            return group;
          }),
          lastSaved: new Date().toISOString()
        }));
      },

      // Diary actions
      setDiary: (diary: Diary) => {
        try {
          // Ensure content is never undefined
          const diaryToSave = {
            ...diary,
            content: diary.content || ''
          };
          
          diarySchema.validateSync(diaryToSave);
          set({ 
            diary: diaryToSave,
            lastSaved: new Date().toISOString()
          });
        } catch (error) {
          console.error('Diary validation error:', error);
          throw error;
        }
      },

      updateSettings: (updates: Partial<Settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
          lastSaved: new Date().toISOString()
        }));
      },

      // History functions
      daychange: async () => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Get current state for history
        const currentState = {
          todos: get().todos.filter(todo => todo.status === 'done'),
          habitGroups: get().habitGroups,
          diary: get().diary
        };
        
        // Skip if there's nothing to save
        if (currentState.todos.length === 0 && 
            !currentState.diary.content && 
            Object.keys(currentState.diary.ratings).length === 0) {
          console.log('No completed todos or diary content to save');
        } else {
          // Save history to persistent storage
          if (Platform.OS === 'web') {
            try {
              // 获取上次保存的日期，而不是今天的日期
              const lastSavedDate = get().lastSaved 
                ? new Date(get().lastSaved || new Date().toISOString()).toISOString().split('T')[0]
                : dateStr;
                
              localStorage.setItem(`todo-history-${lastSavedDate}`, JSON.stringify(currentState));
              console.log(`Saved history for ${lastSavedDate} to localStorage`);
            } catch (error) {
              console.error('Error saving history to localStorage:', error);
            }
          } else {
            try {
              // 获取上次保存的日期，而不是今天的日期
              const lastSavedDate = get().lastSaved 
                ? new Date(get().lastSaved || new Date().toISOString()).toISOString().split('T')[0]
                : dateStr;
                
              const historyDir = `${FileSystem.documentDirectory}history`;
              const dirInfo = await FileSystem.getInfoAsync(historyDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(historyDir, { intermediates: true });
              }
              const filePath = `${historyDir}/${lastSavedDate}.json`;
              await FileSystem.writeAsStringAsync(filePath, JSON.stringify(currentState));
              console.log(`Saved history for ${lastSavedDate} to ${filePath}`);
            } catch (error) {
              console.error('Error saving history to file system:', error);
            }
          }
        }
        
        // Update state for the new day
        set(state => {
          // 1. Update habit groups based on period end dates
          const updatedGroups = state.habitGroups
            .map(group => {
              if (!group) return null; // Skip null groups
              
              const endDate = group.endDate ? new Date(group.endDate) : today;
              
              // If the period has ended, reset habits
              if (endDate >= today) {
                // Calculate new end date based on period
                const newEndDate = calculatePeriodEndDate(group.period, group.frequency);
                
                // Reset all habits in the group
                const resetHabits = group.habits.map(habit => ({
                  ...habit,
                  completedCount: 0,
                  status: 'pending' as TodoStatus
                }));
                
                return {
                  ...group,
                  startDate: today.toISOString(),
                  endDate: newEndDate,
                  habits: resetHabits
                };
              }
              
              return group;
            })
            .filter(Boolean) as HabitGroup[]; // Filter out null values and cast to HabitGroup[]
          
          // 2. Remove empty habit groups (groups with no habits)
          const nonEmptyGroups = updatedGroups.filter(group => group.habits.length > 0);
          
          // 3. Remove completed todos
          const updatedTodos = state.todos.filter(todo => todo.status !== 'done');
          
          // 4. Reset diary for the new day
          const newDiary = {
            date: dateStr,
            content: '',
            ratings: {}
          };
          
          return { 
            habitGroups: nonEmptyGroups,
            todos: updatedTodos,
            diary: newDiary,
            lastSaved: new Date().toISOString()
          };
        });
        
        console.log('Day change completed successfully');
      },

      // 移除 initDiary 函数
    }),
    {
      name: 'todo-app-storage-v2',
      partialize: (state) => {
        return {
          todos: state.todos,
          habitGroups: state.habitGroups,
          diary: state.diary,
          settings: state.settings,
          editingTodoId: state.editingTodoId,
          editingType: state.editingType,
          editingGroupId: state.editingGroupId,
          lastSaved: state.lastSaved,
        };
      },
      onRehydrateStorage: () => {
        return (state) => {
          console.log('Rehydrated state:', state);
        };
      },
    }
  )
);

// Helper function to calculate period end date
function calculatePeriodEndDate(period: HabitPeriod, frequency?: number): string {
  const now = new Date();
  switch (period) {
    case 'daily':
      now.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      now.setDate(now.getDate() + (7 - now.getDay())); // Next Sunday
      now.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      now.setDate(0); // Last day of current month
      now.setHours(23, 59, 59, 999);
      break;
    case 'custom':
      if (frequency) {
        // Convert frequency from minutes to milliseconds
        const milliseconds = frequency * 60 * 1000;
        now.setTime(now.getTime() + milliseconds);
      } else {
        now.setDate(now.getDate() + 1); // Default to next day
      }
      now.setHours(23, 59, 59, 999);
      break;
  }
  return now.toISOString();
}
