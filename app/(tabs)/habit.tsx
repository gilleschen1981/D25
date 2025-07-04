import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Platform, Modal, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Habit, HabitPeriod } from '../../src/models/types';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonStyles } from '../../src/constants/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../../src/i18n';
import { showAlert } from '../../src/utils/alertUtils';

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
      style={CommonStyles.deleteButton}
      onPress={() => {
        const showDeleteConfirmation = () => {
          showAlert(
            i18n.t('habit.deleteTitle'),
            i18n.t('habit.deleteConfirm', { content: item.content }),
            [
              {
                text: i18n.t('common.cancel'),
                style: 'cancel',
                onPress: () => swipeableRef.current?.close()
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
        style={[CommonStyles.listItem, { backgroundColor: item.backgroundColor || '#ffffff' }]}
        onLongPress={() => onLongPress(item)}
      >
        <View style={CommonStyles.contentContainer}>
          <Text style={[
            CommonStyles.itemTitle,
            item.status === 'done' && CommonStyles.doneText
          ]}>{item.content}</Text>
        </View>
        
        <View style={CommonStyles.infoContainer}>
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
            <Text style={CommonStyles.countText}>
              {item.targetCount ? `${item.completedCount || 0}/${item.targetCount}` : '-'}
            </Text>
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
    <View style={CommonStyles.groupContainer}>
      <TouchableOpacity 
        style={CommonStyles.groupHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={CommonStyles.groupTitle}>{groupname}({i18n.t(`habit.periods.${period}`)})</Text>
        <View style={CommonStyles.groupHeaderRight}>
          <Text style={CommonStyles.groupCount}>{habits.length}{i18n.t('habit.items')}</Text>
          <TouchableOpacity 
            onPress={onAddHabit}
            testID={`group-add-button-${period}`}
          >
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
  const currentLanguage = useTodoStore(state => state.settings.general.language);
  const [activeSwipeable, setActiveSwipeable] = useState<Swipeable | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
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
  
  // 监听语言变化，强制组件重新渲染
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage]);

  // 使用memo缓存派生状态以防止不必要的重新计算
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
    if (!newGroupName.trim()) {
      showAlert(i18n.t('common.error'), i18n.t('habit.errors.groupNameEmpty'));
      return;
    }
    
    const now = new Date();
    let endDateObj = new Date();
    
    // Set end date based on period
    if (newGroupPeriod === 'custom') {
      if (!startDate) {
        showAlert(i18n.t('common.error'), i18n.t('habit.errors.startDateRequired'));
        return;
      }

      if (!endDate) {
        showAlert(i18n.t('common.error'), i18n.t('habit.errors.endDateRequired'));
        return;
      }

      if (!frequency || frequency <= 0) {
        showAlert(i18n.t('common.error'), i18n.t('habit.errors.frequencyRequired'));
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
        showAlert(i18n.t('habit.errors.createFailed'), i18n.t('habit.errors.checkInput'));
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
        showAlert(i18n.t('habit.errors.createFailed'), i18n.t('habit.errors.checkInput'));
      }
    }
  };

  return (
    <View style={CommonStyles.container}>
      {habitGroups.length === 0 && (
        <View style={CommonStyles.emptyState}>
          <Text style={CommonStyles.emptyText}>{i18n.t('habit.noData')}</Text>
        </View>
      )}
      <Stack.Screen
        options={{
          title: i18n.t('habit.title'),
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
        contentContainerStyle={CommonStyles.listContainer}
      />
      
      {/* Modal for creating new habit group */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={CommonStyles.modalOverlay}>
          <View style={CommonStyles.modalContent}>
            <Text style={CommonStyles.modalTitle}>{i18n.t('habit.createGroup')}</Text>

            <Text style={CommonStyles.inputLabel}>{i18n.t('habit.groupName')}</Text>
            <TextInput
              style={CommonStyles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder={i18n.t('habit.groupName')}
            />

            <Text style={CommonStyles.inputLabel}>{i18n.t('habit.period')}</Text>
            <View style={CommonStyles.periodSelector}>
              {(['daily', 'weekly', 'monthly', 'custom'] as HabitPeriod[]).map(period => (
                <TouchableOpacity
                  key={period}
                  style={[
                    CommonStyles.periodOption,
                    newGroupPeriod === period && CommonStyles.selectedPeriod
                  ]}
                  onPress={() => setNewGroupPeriod(period)}
                >
                  <Text style={[
                    CommonStyles.periodText,
                    newGroupPeriod === period && CommonStyles.selectedPeriodText
                  ]}>
                    {i18n.t(`habit.periods.${period}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Custom period options */}
            {newGroupPeriod === 'custom' && (
              <>
                <Text style={CommonStyles.inputLabel}>{i18n.t('habit.startDate')}</Text>
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
                      style={CommonStyles.datePickerButton}
                      onPress={() => setShowStartDatePicker(true)}
                    >
                      <Text>{startDate || i18n.t('habit.selectStartDate')}</Text>
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

                <Text style={CommonStyles.inputLabel}>{i18n.t('habit.endDate')}</Text>
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
                      style={CommonStyles.datePickerButton}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Text>{endDate || i18n.t('habit.selectEndDate')}</Text>
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
                
                <View style={CommonStyles.frequencyContainer}>
                  <View style={CommonStyles.frequencyInputContainer}>
                    <Text style={CommonStyles.inputLabel}>{i18n.t('habit.frequency')}</Text>
                    <TextInput
                      style={CommonStyles.frequencyInput}
                      value={frequency?.toString() || ''}
                      onChangeText={(text) => {
                        const num = parseInt(text);
                        if (!isNaN(num) || text === '') {
                          setFrequency(text === '' ? undefined : num);
                        }
                      }}
                      keyboardType="numeric"
                      placeholder={i18n.t('habit.inputValue')}
                    />
                  </View>

                  <View style={CommonStyles.unitSelectorContainer}>
                    <Text style={CommonStyles.inputLabel}>{i18n.t('habit.unit')}</Text>
                    <View style={CommonStyles.unitSelector}>
                      {(['minutes', 'hours', 'days', 'weeks', 'months'] as const).map(unit => (
                        <TouchableOpacity
                          key={unit}
                          style={[
                            CommonStyles.unitOption,
                            frequencyUnit === unit && CommonStyles.selectedUnit
                          ]}
                          onPress={() => setFrequencyUnit(unit)}
                        >
                          <Text style={[
                            CommonStyles.unitText,
                            frequencyUnit === unit && CommonStyles.selectedUnitText
                          ]}>
                            {i18n.t(`habit.units.${unit}`)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </>
            )}
            
            <View style={CommonStyles.modalButtons}>
              <TouchableOpacity
                style={[CommonStyles.modalButton, CommonStyles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={CommonStyles.buttonText}>{i18n.t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[CommonStyles.modalButton, CommonStyles.createButton]}
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
                <Text style={CommonStyles.buttonText}>{i18n.t('common.create')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 删除本地styles定义，使用CommonStyles
