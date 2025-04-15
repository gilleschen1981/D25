# Todo App 技术文档

## 技术栈
- **框架**: React Native (Expo,  Expo Router)   
- **状态管理**: Zustand + `zustand-persist`  
- **导航**: React Navigation (Stack + Tabs)  
- **日期处理**: `date-fns`  
- **持久化**: `AsyncStorage` + `expo-file-system`  
- **UI组件**: React Native Paper  
- **表单**: Formik + Yup  
- **工具库**: `uuid`、`expo-notifications`、`i18next`  

---

## 状态管理方案 (Zustand)

### 1. Store 设计
```typescript
// store/types.ts
interface Todo {
  id: string; // UUID v4
  content: string;
  dueDate: date; // ISO8601
  tomatoTime?: number;
  status: "pending" | "inProgress" | "done";
  priority: number;
  createdAt: date;
}

interface Habit extends Todo {
  period: "daily" | "weekly" | "monthly" | "custom";
  targetCount: number;
  completedCount: number;
  periodEndDate: date;
}

interface Diary {
  date: string; // YYYY-MM-DD
  content: string;
  ratings: Record<string, 1 | 2 | 3 | 4 | 5>;
}

interface Settings {
  soundEnabled: boolean;
  defaultSort: "priority" | "dueDate";
  defaultTomatoTime?: number;
}

interface AppState {
  todos: Todo[];
  habits: Habit[];
  diaries: Diary[];
  settings: Settings;
  // Actions
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "status">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  reorderTodos: (newOrder: Todo[]) => void;
  // ...其他 Action
}W