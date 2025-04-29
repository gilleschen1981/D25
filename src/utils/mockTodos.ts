import { Todo } from '../models/types';
import { generateRandomLightColor } from '../constants/colors';

export const mockTodos: Todo[] = [
  {
    id: '1',
    content: '完成项目需求文档',
    dueDate: '2024-03-25T23:59:59Z',
    tomatoTime: 60,
    status: 'pending',
    priority: 80,
    createdAt: '2024-03-20T09:00:00Z',
    backgroundColor: generateRandomLightColor(),
  },
  {
    id: '2',
    content: '健身30分钟',
    dueDate: '2024-03-21T20:00:00Z',
    status: 'pending',
    priority: 60,
    createdAt: '2024-03-20T08:30:00Z',
    backgroundColor: generateRandomLightColor(),
  },
  {
    id: '3',
    content: '购买 groceries',
    dueDate: '2024-03-22T18:00:00Z',
    tomatoTime: 30,
    status: 'inProgress',
    priority: 50,
    createdAt: '2024-03-19T15:45:00Z',
    backgroundColor: generateRandomLightColor(),
  },
  {
    id: '4',
    content: 'Review PR #123',
    dueDate: '2024-03-21T12:00:00Z',
    status: 'done',
    priority: 70,
    createdAt: '2024-03-18T14:20:00Z',
    backgroundColor: generateRandomLightColor(),
  },
  {
    id: '5',
    content: '预约牙医',
    dueDate: '2024-03-28T09:00:00Z',
    tomatoTime: 15,
    status: 'pending',
    priority: 40,
    createdAt: '2024-03-20T10:15:00Z',
    backgroundColor: generateRandomLightColor(),
  },
];
