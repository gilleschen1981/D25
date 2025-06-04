import { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, Modal, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Habit, HabitPeriod } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { generateRandomLightColor } from '../../src/constants/colors';
import { Strings } from '../../src/constants/strings';
import DateTimePicker from '@react-native-community/datetimepicker';

function HabitItem({ item, onLongPress, activeSwipeable, setActiveSwipeable, onStartPress }: {
  item: Habit;
  onLongPress: (habit: Habit) => void;
  onStartPress: (habit: Habit) => void;
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
          <Text style={[
            styles.habitTitle,
            item.status === 'done' && styles.doneText
          ]}>{item.content}</Text>
        </View>
        
        <View style={styles.infoContainer}>
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
            <Text style={styles.countText}>
              {item.targetCount ? `${item.completedCount || 0}/${item.targetCount}` : '-'}
            </Text>
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
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

function HabitGroup({ period, groupname, habits, onAddHabit, onLongPress, activeSwipeable, setActiveSwipeable, onStartPress }: {
  period: HabitPeriod;
  habits: Habit[];
  groupname:string;
  onAddHabit: () => void;
  onLongPress: (habit: Habit) => void;
  onStartPress: (habit: Habit) => void;
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
        <Text style={styles.groupTitle}>{groupname}({period})</Text>
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
          onStartPress={onStartPress}
          activeSwipeable={activeSwipeable}
          setActiveSwipeable={setActiveSwipeable}
        />
      ))}
    </View>
  );
}

export default function HabitScreen() {
  const router = useRouter();
  // Use more specific selectors to prevent unnecessary re-renders
  const habitGroups = useTodoStore(state => state.habitGroups);
  const addHabitGroup = useTodoStore(state => state.addHabitGroup);
  const [activeSwipeable, setActiveSwipeable] = useState<Swipeable | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPeriod, setNewGroupPeriod] = useState<HabitPeriod>('daily');
  
  // New state variables for custom period
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [frequency, setFrequency] = useState<number | undefined>(undefined);
  const [frequencyUnit, setFrequencyUnit] = useState<'minutes' | 'hours' | 'days' | 'weeks' | 'months'>('days');
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Memoize derived state to prevent unnecessary recalculations
  const allHabits = useMemo(() => 
    habitGroups.flatMap(group => group.habits), 
    [habitGroups]
  );
  
  // Memoize handlers to prevent unnecessary re-renders of child components
  const handleAddHabit = useCallback((period: HabitPeriod) => {
    // Find or create group ID for this period
    const existingGroup = habitGroups.find(group => group.period === period);
    const groupId = existingGroup?.id || '';
    
    useTodoStore.setState({ 
      editingTodoId: null,
      editingType: 'habit',
      editingGroupId: groupId
    });
    
    router.push('/modal/edit-todo');
  }, [habitGroups, router]);
  
  const handleLongPress = useCallback((habit: Habit) => {
    useTodoStore.setState({ 
      editingTodoId: habit.id,
      editingType: 'habit',
      editingGroupId: habit.groupId
    });
    router.push('/modal/edit-todo');
  }, [router]);
  
  const handleStartHabit = useCallback((habit: Habit) => {
    if (habit.tomatoTime) {
      useTodoStore.setState({ editingTodoId: habit.id });
      router.push('/modal/timer');
      // Use updateHabit instead of updateTodo and use the correct variable name
      const { updateHabit } = useTodoStore.getState();
      updateHabit(habit.id, { status: 'inProgress' });
    } else {
      const newCompletedCount = (habit.completedCount || 0) + 1;
      const updates: Partial<Habit> = { 
        completedCount: newCompletedCount 
      };
      if (habit.targetCount && newCompletedCount >= habit.targetCount) {
        updates.status = 'done';
      }
      const { updateHabit } = useTodoStore.getState();
      updateHabit(habit.id, updates);
    }
  }, [router]);

  const handleCreateGroup = () => {
    // Helper function to show alerts that works on both web and mobile
    const showAlert = (title: string, message: string) => {
      if (Platform.OS === 'web') {
        window.alert(`${title}: ${message}`);
      } else {
        Alert.alert(title, message);
      }
    };

    if (!newGroupName.trim()) {
      showAlert('错误', '组名不能为空');
      return;
    }
    
    const now = new Date();
    let endDateObj = new Date();
    
    // Set end date based on period
    if (newGroupPeriod === 'custom') {
      if (!startDate) {
        showAlert('错误', '请选择开始日期');
        return;
      }
      
      if (!endDate) {
        showAlert('错误', '请选择结束日期');
        return;
      }
      
      if (!frequency || frequency <= 0) {
        showAlert('错误', '请输入有效的频率值（大于0）');
        return;
      }
      
      // Convert frequency to minutes based on selected unit
      let frequencyInMinutes = frequency;
      switch (frequencyUnit) {
        case 'hours':
          frequencyInMinutes *= 60;
          break;
        case 'days':
          frequencyInMinutes *= 60 * 24;
          break;
        case 'weeks':
          frequencyInMinutes *= 60 * 24 * 7;
          break;
        case 'months':
          frequencyInMinutes *= 60 * 24 * 30; // Approximate
          break;
      }
      
      try {
        // Log the data we're about to send
        console.log('Creating custom habit group with data:', {
          name: newGroupName,
          period: newGroupPeriod,
          startDate: startDate,
          endDate: endDate,
          frequency: frequencyInMinutes
        });
        
        // Create the new group with all required fields
        const newGroupId = addHabitGroup({
          name: newGroupName,
          period: newGroupPeriod,
          startDate: startDate,
          endDate: endDate,
          frequency: frequencyInMinutes
        });
        
        if (!newGroupId) {
          throw new Error('Failed to create group - no ID returned');
        }
        
        console.log('Created custom habit group with ID:', newGroupId);
        
        // Reset form and close modal
        setModalVisible(false);
        setNewGroupName('');
        setStartDate(undefined);
        setEndDate(undefined);
        setFrequency(undefined);
      } catch (error) {
        console.error('Failed to create custom habit group:', error);
        showAlert('创建失败', '请检查输入是否正确');
      }
    } else {
      // Original logic for non-custom periods
      switch (newGroupPeriod) {
        case 'daily':
          endDateObj.setHours(23, 59, 59, 999);
          break;
        case 'weekly':
          endDateObj.setDate(now.getDate() + (7 - now.getDay()));
          endDateObj.setHours(23, 59, 59, 999);
          break;
        case 'monthly':
          endDateObj = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDateObj.setHours(23, 59, 59, 999);
          break;
      }
      
      try {
        const newGroupId = addHabitGroup({
          name: newGroupName,
          period: newGroupPeriod,
          startDate: now.toISOString(),
          endDate: endDateObj.toISOString()
        });
        
        console.log('Created standard habit group with ID:', newGroupId);
        
        // Reset form and close modal
        setModalVisible(false);
        setNewGroupName('');
      } catch (error) {
        console.error('Failed to create standard habit group:', error);
        showAlert('创建失败', '请检查输入是否正确');
      }
    }
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
            groupname={group.name}
            habits={group.habits}
            onAddHabit={() => handleAddHabit(group.period)}
            onLongPress={handleLongPress}
            onStartPress={handleStartHabit}
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
            
            {/* Custom period options */}
            {newGroupPeriod === 'custom' && (
              <>
                <Text style={styles.inputLabel}>开始日期</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    value={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      fontSize: 16,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 5,
                      marginBottom: 15,
                      width: '100%'
                    }}
                  />
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowStartDatePicker(true)}
                    >
                      <Text>{startDate || '选择开始日期'}</Text>
                    </TouchableOpacity>
                    
                    {showStartDatePicker && (
                      <DateTimePicker
                        value={new Date(startDate || Date.now())}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                          setShowStartDatePicker(false);
                          if (date) {
                            setStartDate(date.toISOString().split('T')[0]);
                          }
                        }}
                      />
                    )}
                  </>
                )}
                
                <Text style={styles.inputLabel}>结束日期</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    value={endDate || ''}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      fontSize: 16,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 5,
                      marginBottom: 15,
                      width: '100%'
                    }}
                  />
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Text>{endDate || '选择结束日期'}</Text>
                    </TouchableOpacity>
                    
                    {showEndDatePicker && (
                      <DateTimePicker
                        value={new Date(endDate || Date.now())}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                          setShowEndDatePicker(false);
                          if (date) {
                            setEndDate(date.toISOString().split('T')[0]);
                          }
                        }}
                      />
                    )}
                  </>
                )}
                
                <View style={styles.frequencyContainer}>
                  <View style={styles.frequencyInputContainer}>
                    <Text style={styles.inputLabel}>频率</Text>
                    <TextInput
                      style={styles.frequencyInput}
                      value={frequency?.toString() || ''}
                      onChangeText={(text) => {
                        const num = parseInt(text);
                        if (!isNaN(num) || text === '') {
                          setFrequency(text === '' ? undefined : num);
                        }
                      }}
                      keyboardType="numeric"
                      placeholder="输入数值"
                    />
                  </View>
                  
                  <View style={styles.unitSelectorContainer}>
                    <Text style={styles.inputLabel}>单位</Text>
                    <View style={styles.unitSelector}>
                      {(['minutes', 'hours', 'days', 'weeks', 'months'] as const).map(unit => (
                        <TouchableOpacity
                          key={unit}
                          style={[
                            styles.unitOption,
                            frequencyUnit === unit && styles.selectedUnit
                          ]}
                          onPress={() => setFrequencyUnit(unit)}
                        >
                          <Text style={[
                            styles.unitText,
                            frequencyUnit === unit && styles.selectedUnitText
                          ]}>
                            {unit === 'minutes' ? '分钟' : 
                             unit === 'hours' ? '小时' : 
                             unit === 'days' ? '天' : 
                             unit === 'weeks' ? '周' : '月'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]} 
                onPress={() => {
                  console.log('Create button pressed');
                  console.log('Current state:', {
                    newGroupName,
                    newGroupPeriod,
                    startDate,
                    endDate,
                    frequency,
                    frequencyUnit
                  });
                  handleCreateGroup();
                }}
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
    marginRight: 16,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  frequencyInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  frequencyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  unitSelectorContainer: {
    flex: 1,
    marginLeft: 10,
  },
  unitSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    margin: 2,
  },
  selectedUnit: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  unitText: {
    fontSize: 12,
    color: '#333',
  },
  selectedUnitText: {
    color: 'white',
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});
