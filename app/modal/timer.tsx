import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { CommonStyles } from '../../src/constants/styles';
import { showAlert } from '../../src/utils/alertUtils';


export default function TimerScreen() {
  const router = useRouter();
  const { todos, updateTodo, editingTodoId, settings } = useTodoStore();
  // Get the todo item
  const todo = todos.find(t => t.id === editingTodoId);
  const initialSeconds = todo?.tomatoTime ? todo.tomatoTime * 60 : 0;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  // Load sound
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Play completion sound
  const playCompletionSound = async () => {
    console.log("Attempting to play sound, soundEnabled:", settings.general.soundEnabled);
    if (settings.general.soundEnabled) {
      try {
        console.log("Loading sound file...");
        // 使用本地资源
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../../assets/sounds/complete.mp3'));
        setSound(soundObject);
        console.log("Playing sound...");
        await soundObject.playAsync();
        console.log("Sound played successfully");
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  console.log("Initial timer state:", { initialSeconds, todo: todo?.tomatoTime });
  // Initialize timer
  useEffect(() => {
    if (todo?.tomatoTime) {
      const initialSeconds = todo.tomatoTime * 60;
      setSecondsLeft(initialSeconds);
      setIsActive(true);
      console.log("Timer initialized with: ", initialSeconds);
    }
  }, [todo]);

  // Countdown interval management
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      console.log("Timer active, secondsLeft:", secondsLeft);
      if (secondsLeft > 0) {
        interval = setInterval(() => {
          setSecondsLeft(prev => {
            const newSeconds = prev - 1;
            console.log("Countdown tick:", newSeconds);
            return newSeconds;
          });
        }, 1000);
      } else {
        handleComplete();
      }
    }

    return () => {
      if (interval) {
        console.log("Clearing interval");
        clearInterval(interval);
      }
    };
  }, [isActive]);

  // Handle timer completion when seconds reach 0
  useEffect(() => {
    if (secondsLeft === 0 && isActive) {
      if (settings.general.soundEnabled) {
        playCompletionSound();
      }
      handleComplete();
    }
  }, [secondsLeft, isActive, settings.general.soundEnabled]);

  const handleComplete = async () => {
    if (settings.general.soundEnabled) {
      await playCompletionSound();
    }
    
    if (todo) {
      const newCompletedCount = (todo.completedCount || 0) + 1;
      const updates: Partial<Todo> = { 
        completedCount: newCompletedCount 
      };
      if (todo.targetCount && newCompletedCount >= todo.targetCount) {
        updates.status = 'done';
        showAlert('任务完成', `${todo.content} 已经完成`);
      } else {
        showAlert('任务进度', `已完成 ${newCompletedCount}/${todo.targetCount || 1} 次`);
      }
      updateTodo(todo.id, updates);
    }
    useTodoStore.setState({ editingTodoId: null});
    router.back();
    console.log("complete");
  };

  const handleRestart = () => {
    if (todo?.tomatoTime) {
      setSecondsLeft(todo.tomatoTime * 60);
      setIsActive(true);
      console.log("restart")
    }
  };

  const handleExit = () => {
    if (todo) {
      updateTodo(todo.id, { status: 'pending' });
    }
    useTodoStore.setState({ editingTodoId: null});
    router.back();
    console.log("exit")
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={CommonStyles.container}>
      <Stack.Screen options={{ title: '计时器' }} />

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 72,
          fontWeight: 'bold',
        }}>{formatTime(secondsLeft)}</Text>
        
        {/* 测试声音按钮 - 仅用于开发 */}
        {__DEV__ && (
          <TouchableOpacity 
            style={[CommonStyles.button, { marginTop: 20, width: 200 }]}
            onPress={playCompletionSound}
          >
            <Text style={CommonStyles.buttonText}>测试声音</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <TouchableOpacity 
          style={CommonStyles.button}
          onPress={handleComplete}
        >
          <MaterialIcons name="stop" size={24} color="white" />
          <Text style={CommonStyles.buttonText}>完成计时</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={CommonStyles.button}
          onPress={handleRestart}
        >
          <MaterialIcons name="replay" size={24} color="white" />
          <Text style={CommonStyles.buttonText}>重新计时</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={CommonStyles.button}
          onPress={handleExit}
        >
          <MaterialIcons name="close" size={24} color="white" />
          <Text style={CommonStyles.buttonText}>退出计时</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 删除本地styles定义，使用CommonStyles
