import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HabitScreen from '../../app/(tabs)/habit';
import { HabitGroup, Habit } from '../../src/models/types';

describe('HabitGroup Component', () => {
  const mockHabitGroup: HabitGroup = {
    id: '1',
    name: "每日习惯",
    period: 'daily',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-04-01T23:59:59Z',
    habits: []
  };
  
  const mockHabit: Habit = {
    id: '101',
    content: '晨跑30分钟',
    status: 'pending',
    priority: 60,
    createdAt: '2024-03-20T09:00:00Z',
    backgroundColor: '#f5f5f5',
    tomatoTime: 30,
    targetCount: 1,
    completedCount: 0,
    groupId: '1'
  };
  
  it('renders correctly', () => {
    const { getByText } = render(
      <HabitScreen />
    );
    
    expect(getByText('每日习惯(daily)')).toBeTruthy();
  });
  
  it('calls onAddHabit when add button is pressed', () => {
    const { getByTestId } = render(
      <HabitScreen />
    );
    
    fireEvent.press(getByTestId('add-habit-button'));
    // Add assertion based on what onAddHabit does
  });
  
  it('calls onLongPress when habit is long pressed', () => {
    const { getByTestId } = render(
      <HabitScreen />
    );
    
    fireEvent.press(getByTestId('habit-item-101'));
    // Add assertion based on what onLongPress does
  });
  
  it('calls onStartPress when start button is pressed', () => {
    const { getByTestId } = render(
      <HabitScreen />
    );
    
    fireEvent.press(getByTestId('start-button-101'));
    // Add assertion based on what onStartPress does
  });
});

