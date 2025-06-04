import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo } from '../../src/models/types';

describe('Todo Store', () => {
  beforeEach(() => {
    // 重置store状态
    useTodoStore.getState().reset();
  });
  
  it('should add a todo', () => {
    const todoToAdd: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
      content: 'Test todo',
      dueDate: '2024-05-01T12:00:00Z',
      tomatoTime: 60,
      targetCount: 1,
      completedCount: 0
    };
    useTodoStore.getState().addTodo(todoToAdd);
    
    const todos = useTodoStore.getState().todos;
    expect(todos.length).toBe(1);
    expect(todos[0].content).toBe('Test todo');
    expect(todos[0].status).toBe('pending');
  });
  
  it('should update a todo status', () => {
    // 先添加一个todo
    const todoToAdd: Omit<Todo, "id" | "createdAt" | "status" | "backgroundColor" | "priority"> = {
      content: 'Test todo',
      dueDate: '2024-05-01T12:00:00Z',
      tomatoTime: 60,
      targetCount: 1,
      completedCount: 0
    };
    useTodoStore.getState().addTodo(todoToAdd);
    
    // 获取todo的id
    const todoId = useTodoStore.getState().todos[0].id;
    
    // 更新状态
    useTodoStore.getState().updateTodo(todoId, { status: 'done' });
    
    // 验证状态已更新
    const updatedTodos = useTodoStore.getState().todos;
    expect(updatedTodos[0].status).toBe('done');
  });
  
  // 添加更多测试...
});