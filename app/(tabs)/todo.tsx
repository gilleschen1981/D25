import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { generateRandomLightColor } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';

function TodoItem({ item, onLongPress, onStartPress, activeSwipeable, setActiveSwipeable }: {
  item: Todo;
  onLongPress: (todo: Todo) => void;
  onStartPress: (todo: Todo) => void;
  activeSwipeable: Swipeable | null;
  setActiveSwipeable: (swipeable: Swipeable | null) => void;
}) {
  const swipeableRef = useRef<Swipeable>(null);
  const { deleteTodo } = useTodoStore();

  const handleSwipeableOpen = () => {
    if (activeSwipeable && activeSwipeable !== swipeableRef.current) {
      activeSwipeable.close();
    }
    setActiveSwipeable(swipeableRef.current);
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        console.log('Delete button pressed for item:', item.id);
        const showDeleteConfirmation = () => {
          if (Platform.OS === 'web') {
            if (window.confirm(`确定要删除"${item.content}"吗？`)) {
              confirmDelete();
            } else {
              cancelDelete();
            }
          } else {
            Alert.alert(
              '删除待办事项',
              `确定要删除"${item.content}"吗？`,
              [
                {
                  text: '取消',
                  style: 'cancel',
                  onPress: cancelDelete
                },
                {
                  text: '删除',
                  style: 'destructive',
                  onPress: confirmDelete
                }
              ]
            );
          }
        };

        const confirmDelete = () => {
          console.log('Deleting item:', item.id);
          deleteTodo(item.id);
          swipeableRef.current?.close();
        };

        const cancelDelete = () => {
          console.log('Delete cancelled');
          swipeableRef.current?.close();
        };

        showDeleteConfirmation();
      }}
    >
      <MaterialIcons name="delete" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
        friction={5}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableClose={() => {
          if (activeSwipeable === swipeableRef.current) {
            setActiveSwipeable(null);
          }
        }}
        enabled={item.status === 'pending'}
      >
        <TouchableOpacity 
        style={[styles.todoItem, { backgroundColor: item.backgroundColor || '#ffffff' }]}
          onLongPress={() => onLongPress(item)}
        >
          <View style={styles.contentContainer}>
            <Text style={[
              styles.todoTitle,
              item.status === 'done' && styles.doneText
            ]}>{item.content}</Text>
          </View>
          
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDateLabel}>截至</Text>
            <Text style={styles.dueDateValue}>
              {item.dueDate ? 
                `${Math.floor((new Date(item.dueDate).getTime() - Date.now()) / 60000)}${Strings.common.minutes}` : 
                '-'}
            </Text>
          </View>

          <View style={styles.tomatoTimeContainer}>
            <Text style={styles.tomatoTimeText}>
              {item.tomatoTime ? `${item.tomatoTime}${Strings.common.minutes}` : '-'}
            </Text>
          </View>

          <View style={styles.countContainer}>
            {item.targetCount && item.targetCount > 1 ? (
              <Text style={styles.countText}>
                {item.completedCount || 0}/{item.targetCount}
              </Text>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.startButton,
              item.status === 'done' && styles.disabledButton
            ]}
            onPress={() => item.status !== 'done' && onStartPress(item)}
            disabled={item.status === 'done'}
          >
            <Text style={styles.startButtonText}>开始</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Swipeable>
  );
}

export default function TodoScreen() {
  const router = useRouter();
  const { todos, updateTodo, deleteTodo } = useTodoStore();
  const [_, forceUpdate] = useState({});
  const [longPressedTodo, setLongPressedTodo] = useState<Todo | null>(null);
  const [activeSwipeable, setActiveSwipeable] = useState<Swipeable | null>(null);

  // Sort todos according to requirements
  const sortedTodos = [...todos].sort((a, b) => {
    // First by priority (descending)
    if (a.priority !== b.priority) return a.priority - b.priority;
    // Then by due date (ascending)
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    // Finally by creation date (ascending)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const handleAddTodo = () => {
    useTodoStore.setState({ 
      editingTodoId: null,
      editingType: 'todo'
    });
    router.push({
      pathname: '/modal/edit-todo',
      params: { 
        backgroundColor: generateRandomLightColor() 
      }
    });
  };

  const handleLongPress = (todo: Todo) => {
    setLongPressedTodo(todo);
    useTodoStore.setState({ 
      editingTodoId: todo.id,
      editingType: 'todo'
    });
    router.push('/modal/edit-todo');
  };

  const handleStartTodo = (todo: Todo) => {
    if (todo.tomatoTime) {
      useTodoStore.setState({ editingTodoId: todo.id });
      router.push('/modal/timer');
      updateTodo(todo.id, { status: 'inProgress' });
    } else {
      const newCompletedCount = (todo.completedCount || 0) + 1;
      const updates: Partial<Todo> = { 
        completedCount: newCompletedCount 
      };
      if (todo.targetCount && newCompletedCount >= todo.targetCount) {
        updates.status = 'done';
      }
      updateTodo(todo.id, updates);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: '待办事项',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={() => useTodoStore.getState().daychange()}
                style={{ paddingRight: 16 }}
              >
                <MaterialIcons name="refresh" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleAddTodo}
                style={{ paddingRight: 16 }}
              >
                <MaterialIcons name="add" size={28} color="black" />
              </TouchableOpacity>
            </View>
          )
        }} 
      />

      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem 
            item={item}
            onLongPress={handleLongPress}
            onStartPress={handleStartTodo}
            activeSwipeable={activeSwipeable}
            setActiveSwipeable={setActiveSwipeable}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  dueDateContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  dueDateLabel: {
    fontSize: 10,
    color: '#666',
  },
  dueDateValue: {
    fontSize: 12,
    color: '#666',
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  tomatoTimeContainer: {
    width: 60,
    marginRight: 16,
    alignItems: 'center',
  },
  tomatoTimeText: {
    fontSize: 12,
    color: '#666',
  },
  countContainer: {
    width: 60,
    marginRight: 16,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: '85%',
    borderRadius: 8,
    marginBottom: 12,
  },
});
