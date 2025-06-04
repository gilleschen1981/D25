import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodoScreen from '../../app/(tabs)/todo';
import { Todo } from '../../src/models/types';

describe('TodoItem Component', () => {
  const mockTodo: Todo = {
    id: '1',
    content: '完成项目需求文档',
    dueDate: '2024-03-25T23:59:59Z',
    tomatoTime: 60,
    status: 'pending',
    priority: 80,
    createdAt: '2024-03-20T09:00:00Z',
    backgroundColor: '#f5f5f5',
  };
  
  it('renders correctly', () => {
    const { getByText } = render(
      <TodoScreen />
    );
    
    expect(getByText('完成项目需求文档')).toBeTruthy();
  });
  
  it('calls onLongPress when todo is long pressed', () => {
    const { getByTestId } = render(
      <TodoScreen />
    );
    
    fireEvent.press(getByTestId('todo-item-1'));
    // Add assertion based on what onLongPress does
  });
  
  it('calls onStartPress when start button is pressed', () => {
    const { getByTestId } = render(
      <TodoScreen />
    );
    
    fireEvent.press(getByTestId('start-button-1'));
    // Add assertion based on what onStartPress does
  });
});


