import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import {Colors} from '../../src/constants/colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <Tabs screenOptions={{ tabBarActiveTintColor: '#2196F3' }}>
        <Tabs.Screen
          name="todo"
          options={{
            title: '待办',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="repeat" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="habit"
          options={{
            title: '习惯',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="repeat" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="diary"
          options={{
            title: '日记',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="book" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: '设置',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            )
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
