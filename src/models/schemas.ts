import * as yup from 'yup';
import { TodoStatus, HabitPeriod, RatingValue } from './types';

export const todoSchema = yup.object().shape({
  content: yup.string().required().max(200),
  dueDate: yup.string().optional(),
  tomatoTime: yup.number().optional().min(1).max(1440),
  status: yup.mixed<TodoStatus>().oneOf(['pending', 'inProgress', 'done']).required(),
  priority: yup.number().required().min(1).max(100),
});

export const habitSchema = todoSchema.concat(
  yup.object().shape({
    period: yup.mixed<HabitPeriod>().oneOf(['daily', 'weekly', 'monthly', 'custom']).required(),
    targetCount: yup.number().required().min(1),
    completedCount: yup.number().required().min(0),
    periodEndDate: yup.string().required(),
  })
);

export const diarySchema = yup.object().shape({
  date: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/),
  content: yup.string().required(),
  ratings: yup
    .object()
    .test('max-dimensions', 'Maximum 5 rating dimensions', (obj) => Object.keys(obj || {}).length <= 5)
    .test(
      'valid-ratings',
      'Ratings must be between 1-5',
      (obj) => {
        if (!obj) return true;
        const values = Object.values(obj);
        return values.every((v): v is RatingValue =>
          typeof v === 'number' && [1, 2, 3, 4, 5].includes(v)
        );
      }
    ),
});