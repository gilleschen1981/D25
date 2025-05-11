import { v4 as uuidv4 } from 'uuid';
import { addDays, endOfDay, endOfWeek } from 'date-fns';
import { generateRandomLightColor } from '../constants/colors';

const now = new Date();

export const mockHabits = [
  {
    id: uuidv4(),
    backgroundColor: generateRandomLightColor(),
    content: '晨跑30分钟',
    status: 'pending',
    priority: 60,
    createdAt: now.toISOString(),
    period: 'daily',
    periodEndDate: endOfDay(now).toISOString(),
    targetCount: 0,
    completedCount: 0,
    tomatoTime: 30
  },
  {
    id: uuidv4(),
    backgroundColor: generateRandomLightColor(),
    content: '阅读30页',
    status: 'pending',
    priority: 50,
    createdAt: now.toISOString(),
    period: 'daily',
    periodEndDate: endOfDay(now).toISOString(),
    targetCount: 1,
    completedCount: 0,
    tomatoTime: 60
  },
  {
    id: uuidv4(),
    backgroundColor: generateRandomLightColor(),
    content: '健身1小时',
    status: 'pending',
    priority: 70,
    createdAt: now.toISOString(),
    period: 'weekly',
    periodEndDate: endOfWeek(now).toISOString(),
    targetCount: 3,
    completedCount: 1,
    tomatoTime: 60
  },
  {
    id: uuidv4(),
    backgroundColor: generateRandomLightColor(),
    content: '学习新语言',
    status: 'pending',
    priority: 40,
    createdAt: now.toISOString(),
    period: 'weekly',
    periodEndDate: endOfWeek(now).toISOString(),
    targetCount: 5,
    completedCount: 2,
    tomatoTime: 30
  },
  {
    id: uuidv4(),
    backgroundColor: generateRandomLightColor(),
    content: '冥想15分钟',
    status: 'pending',
    priority: 80,
    createdAt: now.toISOString(),
    period: 'daily',
    periodEndDate: endOfDay(now).toISOString(),
    targetCount: 0,
    completedCount: 0,
    tomatoTime: 15
  }
] as const;
