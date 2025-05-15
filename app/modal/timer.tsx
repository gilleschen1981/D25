import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';

export default function TimerScreen() {
  const router = useRouter();
  const { todos, updateTodo, editingTodoId,  } = useTodoStore();
  // Get the todo item
  const todo = todos.find(t => t.id === editingTodoId);
  const initialSeconds = todo?.tomatoTime ? todo.tomatoTime * 60 : 0;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
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
      handleComplete();
    }
  }, [secondsLeft]);

  const handleComplete = () => {
    if (todo) {
      const newCompletedCount = (todo.completedCount || 0) + 1;
      const updates: Partial<Todo> = { 
        completedCount: newCompletedCount 
      };
      if (todo.targetCount && newCompletedCount >= todo.targetCount) {
        updates.status = 'done';
        Alert.alert('任务完成', `${todo.content} 已经完成`);
      } else {
        Alert.alert('任务进度', `已完成 ${newCompletedCount}/${todo.targetCount || 1} 次`);
      }
      updateTodo(todo.id, updates);
    }
    useTodoStore.setState({ editingTodoId: null});
    router.back();
    console.log("complete")
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
          <Text style={styles.buttonText}>完成计时</Text>
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
