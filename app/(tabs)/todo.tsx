import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Todo } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonStyles } from '../../src/constants/styles';
import i18n from '../../src/i18n';
import { showAlert } from '../../src/utils/alertUtils';

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
      style={CommonStyles.deleteButton}
      onPress={() => {
        console.log('Delete button pressed for item:', item.id);
        const showDeleteConfirmation = () => {
          showAlert(
            i18n.t('todo.deleteTitle'),
            i18n.t('todo.deleteConfirm', { content: item.content }),
            [
              {
                text: i18n.t('common.cancel'),
                style: 'cancel',
                onPress: cancelDelete
              },
              {
                text: i18n.t('common.delete'),
                style: 'destructive',
                onPress: confirmDelete
              }
            ]
          );
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
        style={[CommonStyles.listItem, { backgroundColor: item.backgroundColor || '#ffffff' }]}
          onLongPress={() => onLongPress(item)}
        >
          <View style={CommonStyles.contentContainer}>
            <Text style={[
              CommonStyles.itemTitle,
              item.status === 'done' && CommonStyles.doneText
            ]}>{item.content}</Text>
          </View>
          
          <View style={CommonStyles.dueDateContainer}>
            <Text style={CommonStyles.dueDateLabel}>{i18n.t('todo.dueDate')}</Text>
            <Text style={CommonStyles.dueDateValue}>
              {item.dueDate ? 
                `${Math.floor((new Date(item.dueDate).getTime() - Date.now()) / 60000)}${i18n.t('common.minutes')}` : 
                '-'}
            </Text>
          </View>

          <View style={CommonStyles.tomatoTimeContainer}>
            <Text style={CommonStyles.tomatoTimeText}>
              {item.tomatoTime ? `${item.tomatoTime}${i18n.t('common.minutes')}` : '-'}
            </Text>
          </View>

          <View style={CommonStyles.countContainer}>
            {item.targetCount && item.targetCount > 1 ? (
              <Text style={CommonStyles.countText}>
                {item.completedCount || 0}/{item.targetCount}
              </Text>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={[
              CommonStyles.startButton,
              item.status === 'done' && CommonStyles.disabledButton
            ]}
            onPress={() => item.status !== 'done' && onStartPress(item)}
            disabled={item.status === 'done'}
          >
            <Text style={CommonStyles.startButtonText}>{i18n.t('todo.start')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Swipeable>
  );
}

export default function TodoScreen() {
  const router = useRouter();
  const { todos, updateTodo } = useTodoStore();
  const currentLanguage = useTodoStore(state => state.settings.general.language);
  const [activeSwipeable, setActiveSwipeable] = useState<Swipeable | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // 监听语言变化，强制组件重新渲染
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage]);

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
    router.push('/modal/edit-todo');
  };

  const handleLongPress = (todo: Todo) => {
    useTodoStore.setState({ 
      editingTodoId: todo.id,
      editingType: 'todo'
    });
    router.push('/modal/edit-todo');
  };

  const handleStartTodo = (todo: Todo) => {
    if (todo.tomatoTime) {
      useTodoStore.setState({ editingTodoId: todo.id });
      updateTodo(todo.id, { status: 'inProgress' });
      router.push('/modal/timer');
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
    <View style={CommonStyles.container}>
      {todos.length === 0 && (
        <View style={CommonStyles.emptyState}>
          <Text style={CommonStyles.emptyText}>{i18n.t('todo.noData')}</Text>
        </View>
      )}
      <Stack.Screen 
        options={{ 
          title: i18n.t('todo.title'),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={() => useTodoStore.getState().daychange()}
                style={{ paddingRight: 16 }}
              >
                <MaterialIcons name="refresh" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity 
                testID="add-todo-button"
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
        contentContainerStyle={CommonStyles.listContainer}
      />
    </View>
  );
}
