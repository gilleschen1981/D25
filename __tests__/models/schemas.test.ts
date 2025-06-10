import { todoSchema, habitSchema, diarySchema } from '../../src/models/schemas';

describe('Schema Validation', () => {
  describe('todoSchema', () => {
    it('validates a valid todo', () => {
      const validTodo = {
        id: '123',
        content: 'Test todo',
        dueDate: '2024-05-01T12:00:00Z',
        status: 'pending',
        priority: 50,
        createdAt: '2024-04-01T10:00:00Z',
        backgroundColor: '#f5f5f5'
      };
      
      expect(() => todoSchema.validateSync(validTodo)).not.toThrow();
    });
    
    it('rejects invalid todo', () => {
      const invalidTodo = {
        content: 'Test todo',
        status: 'invalid-status',
        priority: 150
      };
      
      expect(() => todoSchema.validateSync(invalidTodo)).toThrow();
    });

    it('rejects todo with invalid dueDate format', () => {
      const invalidTodo = {
        id: '123',
        content: 'Test todo',
        dueDate: 'invalid-date',
        status: 'pending',
        priority: 50,
        createdAt: '2024-04-01T10:00:00Z',
        backgroundColor: '#f5f5f5'
      };

      expect(() => todoSchema.validateSync(invalidTodo)).toThrow();
    })
  });
  
  // 类似的测试可以为habitSchema和diarySchema编写
  describe('habitSchema', () => {
    it('validates a valid habit', () => {
      const validHabit = {
        groupId: '123',
        id: '123',
        content: 'Test habit',
        status: 'pending',
        priority: 50,
        createdAt: '2024-04-01T10:00:00Z',
        backgroundColor: '#f5f5f5'
      };

      expect(() => habitSchema.validateSync(validHabit)).not.toThrow();
    });

    it('rejects invalid habit', () => {
      const invalidHabit = {
        content: 'Test habit',
        status: 'invalid-status',
        priority: 150
      };

      expect(() => habitSchema.validateSync(invalidHabit)).toThrow();
    });
  });

  describe('diarySchema', () => {
    it('validates a valid diary entry', () => {
      const validDiary = {
        id: '123',
        date: '2024-04-01',
        content: 'Test diary entry',
        createdAt: '2024-04-01T10:00:00Z',
        backgroundColor: '#f5f5f5'
      };

      expect(() => diarySchema.validateSync(validDiary)).not.toThrow();
    });

    it('rejects invalid diary entry', () => {
      const invalidDiary = {
        content: 'Test diary entry',
        createdAt: 'invalid-date'
      };

      expect(() => diarySchema.validateSync(invalidDiary)).toThrow();
    });
  });
});