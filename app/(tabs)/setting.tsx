import { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useTodoStore } from '../../src/store/useTodoStore';
import { CommonStyles } from '../../src/constants/styles';
import { showAlert } from '../../src/utils/alertUtils';
import i18n, { changeLanguage } from '../../src/i18n';
import { Language } from '../../src/models/types';

const SettingsPage = () => {
  const { settings, updateSettings, reset } = useTodoStore();
  const [localSettings, setLocalSettings] = useState(settings);

  // 当语言设置改变时，更新i18n语言
  useEffect(() => {
    changeLanguage(localSettings.general.language);
  }, [localSettings.general.language]);

  const handleReset = () => {
    showAlert(
      i18n.t('settings.resetConfirm'),
      i18n.t('settings.resetConfirmMessage'),
      [
        { text: i18n.t('common.cancel'), style: "cancel" },
        {
          text: i18n.t('settings.confirmReset'),
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
      <Stack.Screen options={{ title: i18n.t('settings.title') }} />

      <ScrollView>
        <View style={{ marginBottom: 24 }}>
          <Text style={CommonStyles.sectionTitle}>{i18n.t('settings.general')}</Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            <Text style={{ fontSize: 16, color: '#555', flex: 1 }}>{i18n.t('settings.soundNotification')}</Text>
            <Switch
              value={localSettings.general.soundEnabled}
              onValueChange={(value) => handleChange('general', 'soundEnabled', value)}
              testID="sound-enabled-switch"
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>{i18n.t('settings.enableReminders')}</Text>
            <Switch
              value={localSettings.general.reminderEnabled}
              onValueChange={(value) => handleChange('general', 'reminderEnabled', value)}
              testID="reminder-enabled-switch"
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>{i18n.t('settings.remindBefore')}</Text>
            <TextInput
              style={CommonStyles.numberInput}
              keyboardType="numeric"
              value={localSettings.general.remindBefore.toString()}
              onChangeText={(text) => handleChange('general', 'remindBefore', parseInt(text) || 0)}
              testID="remind-before-input"
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>{i18n.t('settings.language')}</Text>
            <View style={CommonStyles.languageSelector}>
              {(['zh', 'en', 'ja'] as Language[]).map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    CommonStyles.languageOption,
                    localSettings.general.language === lang && CommonStyles.selectedLanguage
                  ]}
                  onPress={() => handleChange('general', 'language', lang)}
                >
                  <Text style={[
                    CommonStyles.languageText,
                    localSettings.general.language === lang && CommonStyles.selectedLanguageText
                  ]}>
                    {i18n.t(`settings.languages.${lang}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={CommonStyles.sectionTitle}>{i18n.t('settings.todoSettings')}</Text>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>{i18n.t('settings.defaultTomatoTime')}</Text>
            <TextInput
              style={CommonStyles.numberInput}
              keyboardType="numeric"
              value={localSettings.todo.defaultTomatoTime.toString()}
              onChangeText={(text) => handleChange('todo', 'defaultTomatoTime', parseInt(text) || 0)}
              testID="default-tomato-time-input"
            />
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={CommonStyles.sectionTitle}>{i18n.t('settings.diarySettings')}</Text>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>{i18n.t('settings.diaryTemplate')}</Text>
            <TextInput
              style={CommonStyles.textInput}
              multiline
              value={localSettings.diary.diaryTemplate}
              onChangeText={(text) => handleChange('diary', 'diaryTemplate', text)}
              testID="diary-template-selector"
            />
          </View>

          <View style={CommonStyles.settingRow}>
            <Text style={CommonStyles.settingLabel}>{i18n.t('settings.customDiaryTags')}</Text>
            <View style={CommonStyles.tagsContainer}>
              {localSettings.diary.customDiaryTags.map((tag, index) => (
                <View key={index} style={CommonStyles.tagRow}>
                  <TextInput
                    style={CommonStyles.tagInput}
                    value={tag}
                    onChangeText={(text) => handleTagChange(index, text)}
                    testID={`custom-tag-input-${index}`}
                  />
                  <Text
                    style={CommonStyles.removeTag}
                    onPress={() => removeTag(index)}
                    testID={`remove-tag-button-${index}`}
                  >
                    ×
                  </Text>
                </View>
              ))}
              <Text
                style={CommonStyles.addTag}
                onPress={addTag}
                testID="add-tag-button"
              >
                {i18n.t('settings.addTag')}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[CommonStyles.button, { marginTop: 20, marginBottom: 40 }]}
          onPress={handleReset}
          testID="reset-data-button"
        >
          <Text style={CommonStyles.buttonText}>{i18n.t('settings.resetData')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
