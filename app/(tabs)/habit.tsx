import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, Modal, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Habit, HabitPeriod } from '../../src/models/types';
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
  const { deleteHabit } = useTodoStore();

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
          deleteHabit(item.id);
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
  period: HabitPeriod;
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
  const { habitGroups, deleteHabit, addHabitGroup } = useTodoStore();
  const [activeSwipeable, setActiveSwipeable] = useState<Swipeable | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPeriod, setNewGroupPeriod] = useState<HabitPeriod>('daily');
  
  // Extract all habits from habit groups
  const allHabits = habitGroups.flatMap(group => group.habits);
  
  console.log('Total habit groups:', habitGroups.length);
  console.log('Total habits:', allHabits.length);

  const handleAddHabit = (period: HabitPeriod) => {
    // Find or create group ID for this period
    const existingGroup = habitGroups.find(group => group.period === period);
    const groupId = existingGroup?.id || '';
    
    useTodoStore.setState({ 
      editingTodoId: null,
      editingType: 'habit',
      editingGroupId: groupId
    });
    
    router.push({
      pathname: '/modal/edit-todo',
      params: { 
        backgroundColor: generateRandomLightColor()
      }
    });
  };

  const handleLongPress = (habit: Habit) => {
    useTodoStore.setState({ 
      editingTodoId: habit.id,
      editingType: 'habit',
      editingGroupId: habit.groupId
    });
    router.push('/modal/edit-todo');
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('错误', '组名不能为空');
      return;
    }
    
    const now = new Date();
    let endDate = new Date();
    
    // Set end date based on period
    switch (newGroupPeriod) {
      case 'daily':
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        endDate.setDate(now.getDate() + (7 - now.getDay()));
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        endDate.setDate(now.getDate() + 3); // Default 3 days for custom
        endDate.setHours(23, 59, 59, 999);
        break;
    }
    
    const newGroup = {
      name: newGroupName,
      period: newGroupPeriod,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      frequency: newGroupPeriod === 'custom' ? 4320 : undefined // 3 days in minutes
    };
    
    addHabitGroup(newGroup);
    setModalVisible(false);
    setNewGroupName('');
  };

  return (
    <View style={styles.container}>
      {habitGroups.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>暂无习惯数据</Text>
        </View>
      )}
      <Stack.Screen 
        options={{ 
          title: '习惯追踪',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                onPress={() => useTodoStore.getState().daychange()}
                style={{ paddingRight: 16 }}
              >
                <MaterialIcons name="refresh" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                style={{ paddingRight: 16 }}
              >
                <MaterialIcons name="add" size={28} color="black" />
              </TouchableOpacity>
            </View>
          )
        }} 
      />

      <FlatList
        data={habitGroups}
        keyExtractor={(group) => group.id}
        renderItem={({ item: group }) => (
          <HabitGroup
            period={group.period}
            habits={group.habits}
            onAddHabit={() => handleAddHabit(group.period)}
            onLongPress={handleLongPress}
            activeSwipeable={activeSwipeable}
            setActiveSwipeable={setActiveSwipeable}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Modal for creating new habit group */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>创建新习惯组</Text>
            
            <Text style={styles.inputLabel}>组名</Text>
            <TextInput
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="输入习惯组名称"
            />
            
            <Text style={styles.inputLabel}>周期</Text>
            <View style={styles.periodSelector}>
              {(['daily', 'weekly', 'monthly', 'custom'] as HabitPeriod[]).map(period => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodOption,
                    newGroupPeriod === period && styles.selectedPeriod
                  ]}
                  onPress={() => setNewGroupPeriod(period)}
                >
                  <Text style={[
                    styles.periodText,
                    newGroupPeriod === period && styles.selectedPeriodText
                  ]}>
                    {period === 'daily' ? '每日' : 
                     period === 'weekly' ? '每周' : 
                     period === 'monthly' ? '每月' : '自定义'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]} 
                onPress={handleCreateGroup}
              >
                <Text style={styles.buttonText}>创建</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  periodOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  selectedPeriod: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodText: {
    color: '#333',
  },
  selectedPeriodText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
