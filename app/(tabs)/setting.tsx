import { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { CommonStyles } from '../../src/constants/styles';
import { showAlert } from '../../src/utils/alertUtils';

const SettingsPage = () => {
  const { settings, updateSettings, reset } = useTodoStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleReset = () => {
    showAlert(
      "重置确认",
      "确定要重置所有应用数据吗？此操作不可撤销。",
      [
        { text: "取消", style: "cancel" },
        { 
          text: "确定重置", 
          style: "destructive",
          onPress: () => reset() 
        }
      ]
    );
  };

  const handleChange = (section: keyof typeof settings, key: string, value: any) => {
    const updated = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value
      }
    };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...localSettings.diary.customDiaryTags];
    newTags[index] = value;
    handleChange('diary', 'customDiaryTags', newTags);
  };

  const addTag = () => {
    handleChange('diary', 'customDiaryTags', [...localSettings.diary.customDiaryTags, '']);
  };

  const removeTag = (index: number) => {
    const newTags = localSettings.diary.customDiaryTags.filter((_, i) => i !== index);
    handleChange('diary', 'customDiaryTags', newTags);
  };

  return (
    <View style={CommonStyles.container}>
      <Stack.Screen options={{ title: '设置' }} />
      
      <ScrollView>
        <View style={{ marginBottom: 24 }}>
          <Text style={CommonStyles.sectionTitle}>通用设置</Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            <Text style={{ fontSize: 16, color: '#555', flex: 1 }}>声音提示</Text>
            <Switch
              value={localSettings.general.soundEnabled}
              onValueChange={(value) => handleChange('general', 'soundEnabled', value)}
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>Enable Reminders</Text>
            <Switch
              value={localSettings.general.reminderEnabled}
              onValueChange={(value) => handleChange('general', 'reminderEnabled', value)}
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>Remind Before (minutes)</Text>
            <TextInput
              style={CommonStyles.numberInput}
              keyboardType="numeric"
              value={localSettings.general.remindBefore.toString()}
              onChangeText={(text) => handleChange('general', 'remindBefore', parseInt(text) || 0)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={CommonStyles.sectionTitle}>待办设置</Text>
          
          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>Default Tomato Time (minutes)</Text>
            <TextInput
              style={CommonStyles.numberInput}
              keyboardType="numeric"
              value={localSettings.todo.defaultTomatoTime.toString()}
              onChangeText={(text) => handleChange('todo', 'defaultTomatoTime', parseInt(text) || 0)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={CommonStyles.sectionTitle}>日记设置</Text>
          
          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>Diary Template</Text>
            <TextInput
              style={CommonStyles.textInput}
              multiline
              value={localSettings.diary.diaryTemplate}
              onChangeText={(text) => handleChange('diary', 'diaryTemplate', text)}
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>Custom Diary Tags</Text>
            <View style={CommonStyles.tagsContainer}>
              {localSettings.diary.customDiaryTags.map((tag, index) => (
                <View key={index} style={CommonStyles.tagRow}>
                  <TextInput
                    style={CommonStyles.tagInput}
                    value={tag}
                    onChangeText={(text) => handleTagChange(index, text)}
                  />
                  <Text style={CommonStyles.removeTag} onPress={() => removeTag(index)}>
                    ×
                  </Text>
                </View>
              ))}
              <Text style={CommonStyles.addTag} onPress={addTag}>
                + Add Tag
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[CommonStyles.button, { marginTop: 20, marginBottom: 40 }]}
          onPress={handleReset}
        >
          <Text style={CommonStyles.buttonText}>重置应用数据</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
