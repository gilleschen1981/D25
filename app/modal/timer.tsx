import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function TimerScreen() {
  const router = useRouter();
  const { todos, updateTodo, editingTodoId } = useTodoStore();
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Get the todo item
  const todo = todos.find(t => t.id === editingTodoId);
  
  // Initialize timer
  useEffect(() => {
    if (todo?.tomatoTime) {
      setSecondsLeft(todo.tomatoTime * 60);
    }
  }, [todo]);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      // Timer completed
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [secondsLeft, isActive]);

  const handleComplete = () => {
    if (todo) {
      updateTodo(todo.id, { status: 'done' });
      Alert.alert('任务完成', `${todo.content} 已经完成`);
    }
    router.back();
  };

  const handleRestart = () => {
    if (todo?.tomatoTime) {
      setSecondsLeft(todo.tomatoTime * 60);
      setIsActive(true);
    }
  };

  const handleExit = () => {
    if (todo) {
      updateTodo(todo.id, { status: 'pending' });
    }
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '计时器' }} />

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleComplete}
        >
          <MaterialIcons name="stop" size={24} color="white" />
          <Text style={styles.buttonText}>结束计时</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleRestart}
        >
          <MaterialIcons name="replay" size={24} color="white" />
          <Text style={styles.buttonText}>重新计时</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleExit}
        >
          <MaterialIcons name="close" size={24} color="white" />
          <Text style={styles.buttonText}>退出计时</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
  },
});
