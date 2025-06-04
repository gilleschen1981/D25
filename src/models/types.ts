// Core data types
export type TodoStatus = 'pending' | 'inProgress' | 'done';
export type HabitPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Todo {
  id: string; // UUID v4
  content: string; // max 200 characters
  dueDate?: string; // ISO8601 format
  tomatoTime?: number; // 1-1440 minutes
  status: TodoStatus;
  priority: number; // 1-100
  createdAt: string; // ISO8601 format, readonly
  backgroundColor: string;
  targetCount?: number; // ≥1
  completedCount?: number;
}

export interface Habit extends Todo{
  groupId: string; // Reference to the parent HabitGroup
}

export interface HabitGroup {
  id: string; // UUID v4
  name: string; // Group name
  period: HabitPeriod;
  startDate?: string; // ISO8601 format
  endDate?: string; // ISO8601 format
  frequency?: number; // Optional, minutes, only used when period is 'custom'
  frequencyUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'; // Optional, only used when period is 'custom'
  habits: Habit[];
}

export interface Diary {
  date: string; // YYYY-MM-DD
  content: string;
  ratings: Record<string, number>; // dimension: rating
  weather?: string;
  lastSaved?: string; // ISO timestamp of last save
}

export interface Settings {
  general: {
    soundEnabled: boolean;
    reminderEnabled: boolean;
    remindBefore: number;
  };
  todo: {
    defaultTomatoTime: number;
  };
  diary: {
    diaryTemplate: string;
    customDiaryTags: string[];
  };
}

// App state
export interface AppStateProps {
  todos: Todo[];
  habitGroups: HabitGroup[];
  diary: Diary;
  settings: Settings;
  editingTodoId: string | null;
  editingType: 'todo' | 'habit' | null;
  editingGroupId: string | null;
}

// Action methods
export interface AppState extends AppStateProps {
  reset(): unknown;
  // Todo actions
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (newOrder: Todo[]) => void;
  
  // Habit group actions
  addHabitGroup: (group: Omit<HabitGroup, "id" | "habits">) => string;
  updateHabitGroup: (id: string, updates: Partial<Omit<HabitGroup, "habits">>) => void;
  deleteHabitGroup: (id: string) => void;
  
  // Habit actions
  addHabit: (groupId: string, habit: Omit<Habit, "id" | "createdAt" | "status" | "backgroundColor" | "groupId">) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  
  setDiary: (diary: Diary) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  daychange: () => Promise<void>;
  initDiary: () => void;
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
