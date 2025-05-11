import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Habit } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { generateRandomLightColor } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';

function HabitItem({ item, onLongPress, activeSwipeable, setActiveSwipeable }: {
  item: Habit;
  onLongPress: (habit: Habit) => void;
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
        const showDeleteConfirmation = () => {
          if (Platform.OS === 'web') {
            if (window.confirm(`确定要删除"${item.content}"吗？`)) {
              confirmDelete();
            }
          } else {
            Alert.alert(
              '删除习惯',
              `确定要删除"${item.content}"吗？`,
              [
                { text: '取消', style: 'cancel' },
                { text: '删除', style: 'destructive', onPress: confirmDelete }
              ]
            );
          }
        };

        const confirmDelete = () => {
          deleteTodo(item.id);
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
        style={[styles.habitItem, { backgroundColor: item.backgroundColor || '#ffffff' }]}
        onLongPress={() => onLongPress(item)}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.habitTitle}>{item.content}</Text>
          <Text style={styles.habitProgress}>
            {item.completedCount}/{item.targetCount}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

function HabitGroup({ period, habits, onAddHabit, onLongPress, activeSwipeable, setActiveSwipeable }: {
  period: string;
  habits: Habit[];
  onAddHabit: () => void;
  onLongPress: (habit: Habit) => void;
  activeSwipeable: Swipeable | null;
  setActiveSwipeable: (swipeable: Swipeable | null) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.groupContainer}>
      <TouchableOpacity 
        style={styles.groupHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.groupTitle}>{period}</Text>
        <View style={styles.groupHeaderRight}>
          <Text style={styles.groupCount}>{habits.length}个</Text>
          <TouchableOpacity onPress={onAddHabit}>
            <MaterialIcons name="add" size={24} color="black" />
          </TouchableOpacity>
          <MaterialIcons 
            name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
            size={24} 
            color="black" 
          />
        </View>
      </TouchableOpacity>

      {expanded && habits.map(habit => (
        <HabitItem
          key={habit.id}
          item={habit}
          onLongPress={onLongPress}
          activeSwipeable={activeSwipeable}
          setActiveSwipeable={setActiveSwipeable}
        />
      ))}
    </View>
  );
}

export default function HabitScreen() {
  const router = useRouter();
  const { habits } = useTodoStore();
  const [activeSwipeable, setActiveSwipeable] = useState<Swipeable | null>(null);

  console.log('Total habits from store:', habits.length);
  console.log('Sample habit:', habits[0]);

  // Group habits by period
  const groupedHabits = habits.reduce((acc, habit) => {
    if (!acc[habit.period]) {
      acc[habit.period] = [];
    }
    acc[habit.period].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  const handleAddHabit = (period: string) => {
    router.push({
      pathname: '/modal/edit-todo',
      params: { 
        isHabit: 'true',
        period,
        backgroundColor: generateRandomLightColor()
      }
    });
  };

  const handleLongPress = (habit: Habit) => {
    useTodoStore.setState({ editingTodoId: habit.id });
    router.push('/modal/edit-todo');
  };

  console.log('Grouped habits:', Object.entries(groupedHabits).map(([period, items]) => ({
    period,
    count: items.length
  })));

  return (
    <View style={styles.container}>
      {habits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>暂无习惯数据</Text>
        </View>
      )}
      <Stack.Screen 
        options={{ 
          title: '习惯追踪',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => useTodoStore.getState().daychange()}
              style={{ paddingRight: 16 }}
            >
              <MaterialIcons name="refresh" size={28} color="black" />
            </TouchableOpacity>
          )
        }} 
      />

      <FlatList
        data={Object.entries(groupedHabits)}
        keyExtractor={([period]) => period}
        renderItem={({ item: [period, habits] }) => (
          <HabitGroup
            period={period}
            habits={habits}
            onAddHabit={() => handleAddHabit(period)}
            onLongPress={handleLongPress}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupCount: {
    fontSize: 14,
    color: '#666',
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  habitProgress: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: '85%',
    borderRadius: 8,
    marginBottom: 8,
  },
});
