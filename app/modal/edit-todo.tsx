import { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity, Alert, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditTodoModal() {
  const router = useRouter();
  const { todos, addTodo, updateTodo, editingTodoId } = useTodoStore();

  // Get the todo if editing
  const existingTodo = editingTodoId ? todos.find(t => t.id === editingTodoId) : null;

  // Form state
  const [content, setContent] = useState(existingTodo?.content || '');
  const [hasDueDate, setHasDueDate] = useState(!!existingTodo?.dueDate);
  const [dueDate, setDueDate] = useState(existingTodo?.dueDate || '');
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
  const [hasTomatoTime, setHasTomatoTime] = useState(!!existingTodo?.tomatoTime);
  const [tomatoTime, setTomatoTime] = useState(existingTodo?.tomatoTime?.toString() || '5');
  const [hasTargetCount, setHasTargetCount] = useState(!!existingTodo?.targetCount);
  const [targetCount, setTargetCount] = useState(existingTodo?.targetCount?.toString() || '1');

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('错误', '内容不能为空');
      return;
    }

    if (hasDueDate && dueDate) {
      const now = new Date();
      const selected = new Date(dueDate);
      if (selected <= now) {
        Alert.alert('错误', '截止时间必须晚于当前时间');
        return;
      }
    }

    if (hasTargetCount && (!targetCount || parseInt(targetCount) < 2)) {
      Alert.alert('错误', '重复次数必须大于1');
      return;
    }

    const todoData = {
      content,
      dueDate: hasDueDate ? dueDate : undefined,
      tomatoTime: hasTomatoTime ? parseInt(tomatoTime) : undefined,
      targetCount: hasTargetCount ? parseInt(targetCount) : undefined,
    };

    if (existingTodo) {
      updateTodo(existingTodo.id, todoData);
    } else {
      addTodo(todoData);
    }

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={[styles.container]}>
      <Stack.Screen options={{ title: existingTodo ? '编辑待办事项' : '新建待办事项' }} />

      <TextInput
        style={styles.contentInput}
        placeholder="输入待办事项内容"
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
      />

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>设置截止时间</Text>
          <Switch
            value={hasDueDate}
            onValueChange={setHasDueDate}
          />
        </View>
        {hasDueDate && (
          <View>
            <View style={styles.dateOptionRow}>
              <Button title="今日" onPress={setToday} />
              <Button title="本周" onPress={setThisWeek} />
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

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>需要计时</Text>
          <Switch
            value={hasTomatoTime}
            onValueChange={setHasTomatoTime}
          />
        </View>
        {hasTomatoTime && (
          <TextInput
            style={styles.input}
            placeholder="分钟数 (≥1)"
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

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>设置重复次数</Text>
          <Switch
            value={hasTargetCount}
            onValueChange={setHasTargetCount}
          />
        </View>
        {hasTargetCount && (
          <TextInput
            style={styles.input}
            placeholder="重复次数 (≥2)"
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

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <MaterialIcons name="check" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  section: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
  },
  dateOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
