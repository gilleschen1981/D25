import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTodoStore } from '../../src/store/useTodoStore';

export default function TabLayout() {
  const { lastSaved, daychange } = useTodoStore();

  // 检查日期变更
  useEffect(() => {
    const checkDateChange = async () => {
      if (!lastSaved) return;
      
      const today = new Date();
      const lastSavedDate = new Date(lastSaved);
      
      // 检查是否是不同的日期（忽略时间部分）
      const todayStr = today.toISOString().split('T')[0];
      const lastSavedStr = lastSavedDate.toISOString().split('T')[0];
      
      // 如果当前日期比上次保存的日期晚，执行日期变更
      if (todayStr !== lastSavedStr && today > lastSavedDate) {
        console.log('标签页检测到日期变更，从', lastSavedStr, '到', todayStr);
        try {
          await daychange();
          console.log('标签页日期变更操作完成');
        } catch (error) {
          console.error('标签页日期变更操作失败:', error);
        }
      }
    };
    
    checkDateChange();
  }, [lastSaved, daychange]);

  return (
    <Tabs>
      <Tabs.Screen
        name="todo"
        options={{
          title: '待办',
          tabBarIcon: ({ color }) => <MaterialIcons name="check-box" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="habit"
        options={{
          title: '习惯',
          tabBarIcon: ({ color }) => <MaterialIcons name="repeat" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: '日记',
          tabBarIcon: ({ color }) => <MaterialIcons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: '设置',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
