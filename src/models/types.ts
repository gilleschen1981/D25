// Core data types
export type TodoStatus = 'pending' | 'inProgress' | 'done';
export type HabitPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';
export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Todo {
  id: string; // UUID v4
  content: string; // max 200 characters
  dueDate?: string; // ISO8601 format
  tomatoTime?: number; // 1-1440 minutes
  status: TodoStatus;
  priority: number; // 1-100
  createdAt: string; // ISO8601 format, readonly
  backgroundColor: string;
}

export interface Habit extends Todo {
  period: HabitPeriod;
  targetCount: number; // ≥1
  completedCount: number;
  periodEndDate: string; // ISO8601 format
}

export interface Diary {
  date: string; // YYYY-MM-DD
  content: string;
  ratings: Record<string, RatingValue>; // dimension: rating
}

// Settings types
export type DefaultSortOption = 'priority' | 'dueDate';

export interface Settings {
  soundEnabled: boolean;
  habitReminderEnabled: boolean;
  defaultDiaryTemplate: string;
  defaultSort: DefaultSortOption;
  defaultTomatoTime?: number;
}

// App state
export interface AppStateProps {
  todos: Todo[];
  habits: Habit[];
  diaries: Diary[];
  settings: Settings;
  editingTodoId: string | null;
}



  // Action methods
export interface AppState extends AppStateProps {
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (newOrder: Todo[]) => void;
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "status" | "completedCount" | "periodEndDate">) => void;
  addDiary: (diary: Diary) => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

// Locale configuration
export interface LocaleConfig {
  supportedLocales: {
    'zh-CN': string;
    'en-US': string;
    'ja-JP': string;
  };
  defaultLocale: 'zh-CN';
  dateFormats: {
    short: {
      'zh-CN': string;
      'en-US': string;
      'ja-JP': string;
    };
    long: {
      'zh-CN': string;
      'en-US': string;
      'ja-JP': string;
    };
  };
}
