import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useTodoStore } from '../src/store/useTodoStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
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
        console.log('检测到日期变更，从', lastSavedStr, '到', todayStr);
        try {
          await daychange();
          console.log('日期变更操作完成');
        } catch (error) {
          console.error('日期变更操作失败:', error);
        }
      }
    };
    
    checkDateChange();
  }, [lastSaved, daychange]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
          redirect // 添加这个属性
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal/edit-todo" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
