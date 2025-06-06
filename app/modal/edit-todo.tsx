import { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, Alert, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { MaterialIcons } from '@expo/vector-icons';
import { generateRandomLightColor } from '../../src/constants/colors';
import { showAlert } from '../../src/utils/alertUtils';
import { CommonStyles } from '../../src/constants/styles';
import i18n from '../../src/i18n';

export default function EditTodoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    todos,
    habitGroups,
    addTodo,
    updateTodo,
    addHabit,
    updateHabit,
    editingTodoId,
    editingType,
    editingGroupId
  } = useTodoStore();

  const currentLanguage = useTodoStore(state => state.settings.general.language);
  const [forceUpdate, setForceUpdate] = useState(0);

  // 监听语言变化，强制组件重新渲染
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage]);

  // Get the item if editing
  let existingItem = null;
  if (editingTodoId) {
    if (editingType === 'habit') {
      // Find the habit in the habit groups
      for (const group of habitGroups) {
        const habit = group.habits.find(h => h.id === editingTodoId);
        if (habit) {
          existingItem = habit;
          break;
        }
      }
    } else {
      existingItem = todos.find(t => t.id === editingTodoId);
    }
  }
  
  console.log("EditTodo param: ", existingItem);
  // Form state
  const [content, setContent] = useState(existingItem?.content || '');
  const [hasDueDate, setHasDueDate] = useState(!!existingItem?.dueDate);
  const [dueDate, setDueDate] = useState(existingItem?.dueDate || '');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const setToday = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    
    const localDate = nextHour.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
    const localTime = nextHour.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const dateStr = `${localDate}T${localTime}`;
    setDueDate(dateStr);
    setSelectedDate(new Date(dateStr));
  };

  const setThisWeek = () => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + (7 - now.getDay()));
    sunday.setHours(now.getHours() + 1, 0, 0, 0);
    
    const localDate = sunday.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
    const localTime = sunday.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const dateStr = `${localDate}T${localTime}`;
    setDueDate(dateStr);
    setSelectedDate(new Date(dateStr));
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      // Convert to local datetime string
      const localDate = date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      const localTime = date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const dateStr = `${localDate}T${localTime}`;
      setSelectedDate(date);
      setDueDate(dateStr);
    }
  };
  const [hasTomatoTime, setHasTomatoTime] = useState(!!existingItem?.tomatoTime);
  const [tomatoTime, setTomatoTime] = useState(existingItem?.tomatoTime?.toString() || '5');
  const [hasTargetCount, setHasTargetCount] = useState(!!existingItem?.targetCount);
  const [targetCount, setTargetCount] = useState(existingItem?.targetCount?.toString() || '1');

  const handleSave = () => {
    if (!content.trim()) {
      showAlert(i18n.t('common.error'), i18n.t('editTodo.errors.contentEmpty'));
      return;
    }

    if (editingType !== 'habit' && hasDueDate && dueDate) {
      const now = new Date();
      const selected = new Date(dueDate);
      if (selected <= now) {
        showAlert(i18n.t('common.error'), i18n.t('editTodo.errors.dueDatePast'));
        return;
      }
    }

    if (hasTomatoTime && (!tomatoTime || parseInt(tomatoTime) < 1)) {
      showAlert(i18n.t('common.error'), i18n.t('editTodo.errors.tomatoTimeInvalid'));
      return;
    }

    if (hasTargetCount && (!targetCount || parseInt(targetCount) < 1)) {
      showAlert(i18n.t('common.error'), i18n.t('editTodo.errors.targetCountInvalid'));
      return;
    }

    if (editingType === 'habit') {
      // Make sure we have a valid group ID
      if (!editingGroupId) {
        showAlert(i18n.t('common.error'), i18n.t('editTodo.errors.groupNotSpecified'));
        return;
      }

      const habitData = {
        content,
        tomatoTime: hasTomatoTime ? parseInt(tomatoTime) : undefined,
        targetCount: hasTargetCount ? parseInt(targetCount) : 1,
        completedCount: existingItem?.completedCount || 0,
        priority: existingItem?.priority || 50
      };

      if (existingItem) {
        updateHabit(existingItem.id, habitData);
      } else {
        addHabit(editingGroupId, habitData);
      }
    } else {
      const todoData = {
        content,
        dueDate: hasDueDate ? dueDate : undefined,
        tomatoTime: hasTomatoTime ? parseInt(tomatoTime) : undefined,
        targetCount: hasTargetCount ? parseInt(targetCount) : undefined,
        backgroundColor: params.backgroundColor as string || existingItem?.backgroundColor || generateRandomLightColor(),
        priority: existingItem?.priority || 50
      };

      if (existingItem) {
        updateTodo(existingItem.id, todoData);
      } else {
        addTodo(todoData);
      }
    }

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={CommonStyles.container}>
      <Stack.Screen options={{
        title: existingItem
          ? (editingType === 'habit' ? i18n.t('editTodo.editHabit') : i18n.t('editTodo.editTodo'))
          : (editingType === 'habit' ? i18n.t('editTodo.newHabit') : i18n.t('editTodo.newTodo'))
      }} />

      <TextInput
        style={CommonStyles.contentInput}
        placeholder={i18n.t('editTodo.inputContent')}
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
      />

      {editingType !== 'habit' && (
        <View style={CommonStyles.section}>
          <View style={CommonStyles.switchRow}>
            <Text style={CommonStyles.label}>{i18n.t('editTodo.setDueDate')}</Text>
            <Switch
              value={hasDueDate}
              onValueChange={setHasDueDate}
            />
          </View>
          {hasDueDate && (
            <View>
              <View style={CommonStyles.dateOptionRow}>
                <Button title={i18n.t('editTodo.today')} onPress={setToday} />
                <Button title={i18n.t('editTodo.thisWeek')} onPress={setThisWeek} />
              </View>
              {hasDueDate && (
                Platform.OS === 'web' ? (
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                    }}
                    style={{
                      fontSize: 16,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 5,
                      marginTop: 10,
                      width: '100%'
                    }}
                  />
                ) : (
                  <DateTimePicker
                    value={selectedDate}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                  />
                )
              )}
            </View>
          )}
        </View>
      )}

      <View style={CommonStyles.section}>
        <View style={CommonStyles.switchRow}>
          <Text style={CommonStyles.label}>{i18n.t('editTodo.needTimer')}</Text>
          <Switch
            value={hasTomatoTime}
            onValueChange={setHasTomatoTime}
          />
        </View>
        {hasTomatoTime && (
          <TextInput
            style={CommonStyles.input}
            placeholder={i18n.t('editTodo.minutesPlaceholder')}
            value={tomatoTime}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setTomatoTime(text);
              }
            }}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={CommonStyles.section}>
        <View style={CommonStyles.switchRow}>
          <Text style={CommonStyles.label}>{i18n.t('editTodo.setRepeatCount')}</Text>
          <Switch
            value={hasTargetCount}
            onValueChange={setHasTargetCount}
          />
        </View>
        {hasTargetCount && (
          <TextInput
            style={CommonStyles.input}
            placeholder={i18n.t('editTodo.repeatCountPlaceholder')}
            value={targetCount}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setTargetCount(text);
              }
            }}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={CommonStyles.buttonRow}>
        <TouchableOpacity style={CommonStyles.cancelButton} onPress={handleCancel}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={CommonStyles.saveButton} onPress={handleSave}>
          <MaterialIcons name="check" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 删除本地styles定义，使用CommonStyles
