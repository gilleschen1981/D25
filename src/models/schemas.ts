import * as yup from 'yup';
import { TodoStatus, HabitPeriod } from './types';

export const todoSchema = yup.object().shape({
  content: yup.string().required().max(200),
  dueDate: yup.date().optional(),
  tomatoTime: yup.number().optional().min(1).max(1440),
  status: yup.mixed<TodoStatus>().oneOf(['pending', 'inProgress', 'done']).required(),
  priority: yup.number().required().min(1).max(100),
});

export const habitSchema = yup.object().shape({
  id: yup.string().required(),
  content: yup.string().required().max(200),
  tomatoTime: yup.number().optional().min(1).max(1440),
  status: yup.mixed<TodoStatus>().oneOf(['pending', 'inProgress', 'done']).required(),
  priority: yup.number().required().min(1).max(100),
  createdAt: yup.string().required(),
  backgroundColor: yup.string().required(),
  targetCount: yup.number().optional().min(1),
  completedCount: yup.number().optional().min(0),
  groupId: yup.string().required(),
});

export const habitGroupSchema = yup.object().shape({
  id: yup.string().required(),
  period: yup.mixed<HabitPeriod>().oneOf(['daily', 'weekly', 'monthly', 'custom']).required(),
  frequency: yup.number().when('period', (values: HabitPeriod[], schema) => 
    values[0] === 'custom' ? schema.required().min(1) : schema.optional()
  ),
  habits: yup.array().of(habitSchema),
});

export const diarySchema = yup.object().shape({
  date: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/),
  content: yup.string().default(''), // Make content optional with default empty string
  ratings: yup
    .object()
    .test('max-dimensions', 'Maximum 5 rating dimensions', (obj) => Object.keys(obj || {}).length <= 5)
    .test(
      'valid-ratings',
      'Ratings must be between 1-5',
      (obj) => {
        if (!obj) return true;
        const values = Object.values(obj);
        return values.every((v) =>
          typeof v === 'number' && v >= 0 && v <= 5
        );
      }
    ),
  weather: yup.string().optional()
});
