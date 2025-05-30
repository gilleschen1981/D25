import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useTodoStore } from '../../src/store/useTodoStore';

const SettingsPage = () => {
  const { settings, updateSettings } = useTodoStore();
  const [localSettings, setLocalSettings] = useState(settings);

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
    <ScrollView style={styles.container}>
      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Sounds</Text>
          <Switch
            value={localSettings.general.soundEnabled}
            onValueChange={(value) => handleChange('general', 'soundEnabled', value)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Reminders</Text>
          <Switch
            value={localSettings.general.reminderEnabled}
            onValueChange={(value) => handleChange('general', 'reminderEnabled', value)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Remind Before (minutes)</Text>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={localSettings.general.remindBefore.toString()}
            onChangeText={(text) => handleChange('general', 'remindBefore', parseInt(text) || 0)}
          />
        </View>
      </View>

      {/* Todo Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todo Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Default Tomato Time (minutes)</Text>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={localSettings.todo.defaultTomatoTime.toString()}
            onChangeText={(text) => handleChange('todo', 'defaultTomatoTime', parseInt(text) || 0)}
          />
        </View>
      </View>

      {/* Diary Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diary Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Diary Template</Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={localSettings.diary.diaryTemplate}
            onChangeText={(text) => handleChange('diary', 'diaryTemplate', text)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Custom Diary Tags</Text>
          <View style={styles.tagsContainer}>
            {localSettings.diary.customDiaryTags.map((tag, index) => (
              <View key={index} style={styles.tagRow}>
                <TextInput
                  style={styles.tagInput}
                  value={tag}
                  onChangeText={(text) => handleTagChange(index, text)}
                />
                <Text style={styles.removeTag} onPress={() => removeTag(index)}>
                  ×
                </Text>
              </View>
            ))}
            <Text style={styles.addTag} onPress={addTag}>
              + Add Tag
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  numberInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
  },
  tagsContainer: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  removeTag: {
    fontSize: 20,
    color: 'red',
    paddingHorizontal: 8,
  },
  addTag: {
    color: 'blue',
    marginTop: 8,
  },
});

export default SettingsPage;
