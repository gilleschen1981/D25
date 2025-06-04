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
  });
  
  // 类似的测试可以为habitSchema和diarySchema编写
});