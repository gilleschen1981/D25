import { v4 as uuidv4 } from 'uuid';
import { HabitGroup, Habit } from '../models/types';
import { generateRandomLightColor } from '../constants/colors';

const now = new Date();

// Helper function to create a habit
const createHabit = (content: string, priority: number, tomatoTime: number | undefined, targetCount: number = 1, groupId: string): Habit => ({
  id: uuidv4(),
  content,
  status: 'pending',
  priority,
  createdAt: now.toISOString(),
  backgroundColor: generateRandomLightColor(),
  tomatoTime,
  targetCount,
  completedCount: 0,
  groupId
});

// Helper function to get end of day
const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to get end of week (Sunday)
const endOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (7 - day));
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to get end of month
const endOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0); // Last day of current month
  result.setHours(23, 59, 59, 999);
  return result;
};

// Helper function to add days
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Create mock habit groups
export const mockHabitGroups: HabitGroup[] = [
  // Daily habits group
  {
    id: uuidv4(),
    name: "每日习惯",
    period: 'daily',
    startDate: now.toISOString(),
    endDate: endOfDay(now).toISOString(),
    habits: []
  },
  
  // Weekly habits group
  {
    id: uuidv4(),
    name: "每周习惯",
    period: 'weekly',
    startDate: now.toISOString(),
    endDate: endOfWeek(now).toISOString(),
    habits: []
  },
  
  // Monthly habits group
  {
    id: uuidv4(),
    name: "每月习惯",
    period: 'monthly',
    startDate: now.toISOString(),
    endDate: endOfMonth(now).toISOString(),
    habits: []
  },
  
  // Custom habits group (3-day period)
  {
    id: uuidv4(),
    name: "自定义周期",
    period: 'custom',
    startDate: now.toISOString(),
    endDate: endOfDay(addDays(now, 3)).toISOString(),
    frequency: 4320, // 3 days in minutes
    habits: []
  }
];

// Add habits to the groups
const dailyGroupId = mockHabitGroups[0].id;
mockHabitGroups[0].habits = [
  createHabit('晨跑30分钟', 60, 30, 1, dailyGroupId),
  createHabit('阅读30页', 50, 60, 1, dailyGroupId),
  createHabit('冥想15分钟', 80, 15, 1, dailyGroupId)
];

const weeklyGroupId = mockHabitGroups[1].id;
mockHabitGroups[1].habits = [
  createHabit('健身1小时', 70, 60, 3, weeklyGroupId),
  createHabit('学习新语言', 40, 30, 5, weeklyGroupId)
];

const monthlyGroupId = mockHabitGroups[2].id;
mockHabitGroups[2].habits = [
  createHabit('读完一本书', 60, 0, 1, monthlyGroupId),
  createHabit('写一篇博客', 50, 120, 2, monthlyGroupId)
];

const customGroupId = mockHabitGroups[3].id;
mockHabitGroups[3].habits = [
  createHabit('项目进度检查', 90, 60, 1, customGroupId)
];
