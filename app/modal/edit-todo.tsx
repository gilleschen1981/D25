// app/modal/edit-todo.tsx
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function EditTodoModal() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ title: '编辑待办事项' }} />
      <Text>待办事项编辑表单（开发中）</Text>
    </View>
  );
}