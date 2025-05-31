**User:**

<task>
'doc/' (see below for folder content) 现在我们来开发习惯模块，先帮我生成5条mock的Habit，每日和每周类型都要有
</task>

<folder_content path="doc/">
├── sample.png
├── Todo_Req.md
└── Todo_Tech.md

<file_content path="doc/Todo_Req.md">
# Todo App 需求文档

## 1. 产品概述
一款安卓平台的时间管理应用，包含待办事项、习惯追踪、日记记录和系统设置四大核心模块。

## 2. 功能需求

### 2.1 待办模块
#### 2.1.1 核心功能
- **添加待办**
  - 必填字段：内容
  - 可选字段：预估时间（分钟），截止时间（精确到分钟）
  - 自动生成：唯一ID（仅内部使用）、创建时间、默认状态（待办）
  - 特殊规则：
    - 填写预估时间后强制要求计时完成

- **编辑待办**
  - 可修改字段：内容、截止时间、预估时间
  - 禁止修改：ID、创建时间
- **删除待办**

- **状态管理**
  - 三种状态：待办（默认）→ 进行中 → 完成
  - 计时规则：
    - 无预估时间：可直接标记完成
    - 有预估时间：必须完成计时才能自动转为"完成"状态
    - 异常处理：跳过计时/停止计时 → 状态回滚为"待办"

#### 2.1.2 排序系统
- **自动排序**
  - 第一优先级：用户设置的手动优先级值（默认50）
  - 第二优先级：截止时间（升序）
  - 第三优先级：创建时间（升序）

- **手动调整**
  - 交互方式：长按拖拽
  - 重排逻辑：被移动项获得新优先级值（1-N连续整数）

### 2.2 习惯模块
#### 2.2.1 周期系统
| 周期类型 | 截止时间规则       | 重置规则               |
|----------|--------------------|------------------------|
| 每日     | 当天23:59          | 次日00:00刷新          |
| 每周     | 当周周日23:59      | 下周一00:00刷新        |
| 每月     | 当月最后一天23:59   | 次月1日00:00刷新       |
| 自定义   | 按N天后23:59计算   | N天后的次日00:00刷新   |

#### 2.2.2 时间和次数
- 习惯有两种，一种按照总时间评价，一种按照完成次数评价。
- 如果选择时间，可以不用设置次数
- 周期内总计时时间达标->标记为"完成"
- 如果设置次数，必须设置完成次数≥1
- 周期内完成次数达标 → 标记为"完成"
- 设置次数的情况下，也可以设置预估时间，这个时间表示每一次的时间。
- 周期结束未达标 → 不继承次数，完全重置

#### 2.2.3 核心功能
- **添加习惯**
  - 必填字段：周期，内容
  - 可选字段：次数，预估时间（分钟），截止时间（精确到分钟）
  - 自动生成：唯一ID（仅内部使用）、创建时间、默认状态（待办）
- **编辑习惯**
  - 可修改字段：内容、次数，截止时间、预估时间
  - 禁止修改：ID、创建时间，周期
- **删除习惯**

### 2.3 日记模块
#### 2.3.1 基础功能
- **模板系统**
  - 预设模板需包含：日期自动插入（格式：YYYY-MM-DD）
  - 示例模板：
    ```
   {日期}		{天气}
    完成事项：{{items}}
    心得体会：
    ```

- **评价系统**
  - 维度管理：
    - 最大5个维度
    - 维度名称限制：10字符（支持中英文）
    - 评分范围：1-5星
  - 历史数据：删除维度后仍保留原始记录

#### 2.3.2 智能生成（可选）
- 触发条件：用户手动请求
- 输入数据：
  ```json
  {
    "date": "2024-03-20",
    "completed_todos": ["写文档", "健身"],
    "habit_progress": {"晨跑": "3/5"},
    "ratings": {"效率": 4, "心情": 3}
  }
  ```
- 输出要求：生成后可编辑，需用户确认保存

### 2.4 设置模块
#### 2.4.1 分组结构
	```
	通用设置
	├─ 声音提示开关
	├─ 默认排序规则（优先级/截止时间）
	└─ 新待办默认预估时间

	数据管理
	├─ 数据备份
	└─ 数据恢复
	```
#### 2.4.2 配置项
设置项	类型	默认值
启用计时完成提醒音	开关	开
习惯周期结束提醒	开关	关
默认日记模板	下拉框	简洁模板
### 2.5 用户系统（Mock版）
登录流程
输入字段：用户名、密码
交互规则：
模拟1秒网络延迟
错误提示："登录失败"（不区分具体原因）
用户数据
存储字段：用户名、头像（预设图标）
头像规格：100x100px PNG格式


## 3. 数据规范

### 3.1 核心数据结构

#### 3.1.1 待办事项
```typescript
interface Todo {
  id: uuid;                  // UUID v4
  content: string;             // 最大200字符
  dueDate: date;             // ISO8601格式
  tomatoTime: number;   // 1-1440
  status: 'pending'|'inProgress'|'done';
  priority: number;            // 1-100
  createdAt: date;           // 只读
}
```

#### 3.1.2 习惯记录
```typescript
interface Habit extends Todo {
  period: 'daily'|'weekly'|'monthly'|'custom';
  targetCount: number;         // ≥1
  completedCount: number;
  periodEndDate: date;       // 自动计算
}
```

#### 3.1.3 日记条目
```typescript
interface Diary {
  date: date;                // YYYY-MM-DD
  content: string;
  ratings: Record<string, 1|2|3|4|5>; // 维度:评分
}
```

### 3.2 持久化方案

#### 3.2.1 存储结构
```json
当前数据格式：
  {
    "todos": [],
    "habits": [],
    "settings": {}
  }
 历史数据每天存一个文件：
 /history/YYYY-MM-DD.json",

```


### 3.3 数据约束

| 实体 | 约束条件 |
|------|----------|
| 待办 | 有预估时间时必须计时完成 |
| 习惯 | targetCount ≥ completedCount |
| 日记 | 最多5个评价维度 |

  
## 4. 国际化支持

### 4.1 语言与区域设置

```typescript
interface LocaleConfig {
  /**
   * 支持的语言包
   * @key 语言代码 (BCP 47格式)
   * @value 显示名称
   */
  supportedLocales: {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語'
  };

  // 默认语言设置
  defaultLocale: 'zh-CN';

  // 日期格式配置
  dateFormats: {
    short: {
      'zh-CN': 'YYYY-MM-DD',
      'en-US': 'MM/DD/YYYY',
      'ja-JP': 'YYYY/MM/DD'
    },
    long: {
      'zh-CN': 'YYYY年M月D日',
      'en-US': 'MMMM D, YYYY',
      'ja-JP': 'YYYY年M月D日'
    }
  };
}
```

</file_content>

<file_content path="doc/Todo_Tech.md">
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
</file_content>
</folder_content>
<environment_details>
# VSCode Visible Files
app/modal/edit-todo.tsx

# VSCode Open Tabs
app/(tabs)/todo.tsx
src/models/types.ts
src/store/useTodoStore.ts
app/modal/timer.tsx
app/modal/edit-todo.tsx

# Current Time
5/11/2025, 7:13:12 PM (Asia/Shanghai, UTC+8:00)

# Current Working Directory (c:/_SourceCode/NodeWorkspace/D25) Files
.gitignore
app.json
babel.config.js
metro.config.js
package-lock.json
package.json
README.md
tsconfig.json
app/
app/_layout.tsx
app/[...missing].tsx
app/+html.tsx
app/index.tsx
app/(tabs)/
app/(tabs)/_layout.tsx
app/(tabs)/diary.tsx
app/(tabs)/habit.tsx
app/(tabs)/setting.tsx
app/(tabs)/todo.tsx
app/modal/
app/modal/edit-todo.tsx
app/modal/timer.tsx
assets/
assets/fonts/
assets/fonts/SpaceMono-Regular.ttf
assets/images/
assets/images/adaptive-icon.png
assets/images/favicon.png
assets/images/icon.png
assets/images/splash.png
doc/
doc/sample.png
doc/Todo_Req.md
doc/Todo_Tech.md
src/
src/constants/
src/constants/colors.ts
src/constants/strings.ts
src/constants/styles.ts
src/constants/times.ts
src/models/
src/models/schemas.ts
src/models/types.ts
src/store/
src/store/index.ts
src/store/useTodoStore.ts
src/utils/
src/utils/mockTodos.ts

# Context Window Usage
0 / 64K tokens used (0%)

# Current Mode
ACT MODE
</environment_details>

---

**Assistant:**

<thinking>
1. 根据需求文档，习惯(Habit)的数据结构继承自Todo，并添加了周期(period)、目标次数(targetCount)、已完成次数(completedCount)和周期结束日期(periodEndDate)字段
2. 需要生成5条mock习惯数据，包含每日和每周类型
3. 习惯有两种完成方式：基于时间或基于次数
4. 可以从src/utils/mockTodos.ts文件中获取灵感，可能需要创建类似的mockHabits.ts文件
5. 需要先检查是否已有mockHabits.ts文件
</thinking>

<list_files>
<path>src/utils</path>
</list_files>

---

**User:**

[list_files for 'src/utils'] Result:
mockTodos.ts
<environment_details>
# VSCode Visible Files
app/modal/edit-todo.tsx

# VSCode Open Tabs
app/(tabs)/todo.tsx
src/models/types.ts
src/store/useTodoStore.ts
app/modal/timer.tsx
app/modal/edit-todo.tsx

# Current Time
5/11/2025, 7:13:28 PM (Asia/Shanghai, UTC+8:00)

# Context Window Usage
12,303 / 64K tokens used (19%)

# Current Mode
ACT MODE
</environment_details>

---

**Assistant:**

<thinking>
1. 确认src/utils目录下只有mockTodos.ts文件，没有mockHabits.ts
2. 需要创建一个新的mockHabits.ts文件来存放习惯的mock数据
3. 根据需求文档中的Habit接口定义，mock数据需要包含：
   - 基础Todo字段(id, content, status等)
   - 习惯特有字段(period, targetCount, completedCount, periodEndDate)
4. 生成5条mock数据，包含：
   - 每日习惯(period: 'daily') 
   - 每周习惯(period: 'weekly')
   - 基于时间的习惯(不设置targetCount)
   - 基于次数的习惯(设置targetCount)
5. 需要计算periodEndDate(每日习惯为当天23:59，每周习惯为当周周日23:59)
</thinking>

<write_to_file>
<path>src/utils/mockHabits.ts</path>
<content>
import { v4 as uuidv4 } from 'uuid';
import { addDays, endOfDay, endOfWeek } from 'date-fns';

const now = new Date();

export const mockHabits = [
  {
    id: uuidv4(),
    content: '晨跑30分钟',
    status: 'pending',
    priority: 60,
    createdAt: now,
    period: 'daily',
    periodEndDate: endOfDay(now),
    targetCount: 0,
    completedCount: 0,
    tomatoTime: 30
  },
  {
    id: uuidv4(),
    content: '阅读30页',
    status: 'pending',
    priority: 50,
    createdAt: now,
    period: 'daily',
    periodEndDate: endOfDay(now),
    targetCount: 1,
    completedCount: 0,
    tomatoTime: 60
  },
  {
    id: uuidv4(),
    content: '健身1小时',
    status: 'pending',
    priority: 70,
    createdAt: now,
    period: 'weekly',
    periodEndDate: endOfWeek(now),
    targetCount: 3,
    completedCount: 1,
    tomatoTime: 60
  },
  {
    id: uuidv4(),
    content: '学习新语言',
    status: 'pending',
    priority: 40,
    createdAt: now,
    period: 'weekly',
    periodEndDate: endOfWeek(now),
    targetCount: 5,
    completedCount: 2,
    tomatoTime: 30
  },
  {
    id: uuidv4(),
    content: '冥想15分钟',
    status: 'pending',
    priority: 80,
    createdAt: now,
    period: 'daily',
    periodEndDate: endOfDay(now),
    targetCount: 0,
    completedCount: 0,
    tomatoTime: 15
  }
] as const;
</content>
</write_to_file>

---

**User:**

[write_to_file for 'src/utils/mockHabits.ts'] Result:
The content was successfully saved to src/utils/mockHabits.ts.

Here is the full, updated content of the file that was saved:

<final_file_content path="src/utils/mockHabits.ts">
import { v4 as uuidv4 } from 'uuid';
import { addDays, endOfDay, endOfWeek } from 'date-fns';

const now = new Date();

export const mockHabits = [
  {
    id: uuidv4(),
    content: '晨跑30分钟',
    status: 'pending',
    priority: 60,
    createdAt: now,
    period: 'daily',
    periodEndDate: endOfDay(now),
    targetCount: 0,
    completedCount: 0,
    tomatoTime: 30
  },
  {
    id: uuidv4(),
    content: '阅读30页',
    status: 'pending',
    priority: 50,
    createdAt: now,
    period: 'daily',
    periodEndDate: endOfDay(now),
    targetCount: 1,
    completedCount: 0,
    tomatoTime: 60
  },
  {
    id: uuidv4(),
    content: '健身1小时',
    status: 'pending',
    priority: 70,
    createdAt: now,
    period: 'weekly',
    periodEndDate: endOfWeek(now),
    targetCount: 3,
    completedCount: 1,
    tomatoTime: 60
  },
  {
    id: uuidv4(),
    content: '学习新语言',
    status: 'pending',
    priority: 40,
    createdAt: now,
    period: 'weekly',
    periodEndDate: endOfWeek(now),
    targetCount: 5,
    completedCount: 2,
    tomatoTime: 30
  },
  {
    id: uuidv4(),
    content: '冥想15分钟',
    status: 'pending',
    priority: 80,
    createdAt: now,
    period: 'daily',
    periodEndDate: endOfDay(now),
    targetCount: 0,
    completedCount: 0,
    tomatoTime: 15
  }
] as const;

</final_file_content>

IMPORTANT: For any future changes to this file, use the final_file_content shown above as your reference. This content reflects the current state of the file, including any auto-formatting (e.g., if you used single quotes but the formatter converted them to double quotes). Always base your SEARCH/REPLACE operations on this final version to ensure accuracy.


<environment_details>
# VSCode Visible Files
src/utils/mockHabits.ts

# VSCode Open Tabs
app/(tabs)/todo.tsx
src/models/types.ts
src/store/useTodoStore.ts
app/modal/timer.tsx
app/modal/edit-todo.tsx
src/utils/mockHabits.ts

# Current Time
5/11/2025, 7:14:07 PM (Asia/Shanghai, UTC+8:00)

# Context Window Usage
13,073 / 64K tokens used (20%)

# Current Mode
ACT MODE
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
已创建包含5条mock习惯数据的src/utils/mockHabits.ts文件，包含：
1. 每日习惯(晨跑30分钟、阅读30页、冥想15分钟)
2. 每周习惯(健身1小时、学习新语言)
3. 基于时间的习惯(晨跑30分钟、冥想15分钟)
4. 基于次数的习惯(阅读30页、健身1小时、学习新语言)
</result>
</attempt_completion>

