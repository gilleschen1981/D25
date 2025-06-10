import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, ScrollView,TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Diary } from '../../src/models/types';
import StarRating from '../../src/components/StarRating';
import { showAlert } from '../../src/utils/alertUtils';
import { generateDiaryTemplate } from '../../src/utils/diaryUtils';
import { CommonStyles } from '../../src/constants/styles';
import i18n from '../../src/i18n';

export default function DiaryScreen() {
  const { diary, settings, setDiary, lastSaved } = useTodoStore();
  const currentLanguage = useTodoStore(state => state.settings.general.language);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialRender = useRef(true);
  const prevDiaryRef = useRef<Diary | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // 监听语言变化，强制组件重新渲染
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage]);

  // 初始化日记内容
  useEffect(() => {
    if (diary.content === '') {
      // 如果日记内容为空，则生成模板内容
        const today = new Date().toISOString().split('T')[0];
        const { content, ratings } = generateDiaryTemplate(
          settings.diary.diaryTemplate,
          today,
          diary.weather,
          settings.diary.customDiaryTags
        );
        
        // 保留现有评分，添加新的评分
        const mergedRatings = {
          ...ratings,
          ...diary.ratings
        };
        
        setDiary({
          ...diary,
          content,
          ratings: mergedRatings
        });
      }
  }, [diary, settings, setDiary]);
  
  // Auto-save function
  const autoSave = useCallback(() => {
    try {
      // Only save if content or ratings have changed
      const prevDiary = prevDiaryRef.current;
      const hasContentChanged = prevDiary && prevDiary.content !== diary.content;
      const hasRatingsChanged = prevDiary && JSON.stringify(prevDiary.ratings) !== JSON.stringify(diary.ratings);
      
      if (hasContentChanged || hasRatingsChanged) {
        setDiary({
          ...diary
        });
        console.log('Auto-saved diary at', new Date().toLocaleTimeString());
        
        // Update the previous diary reference
        prevDiaryRef.current = { ...diary };
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [diary, setDiary]);
  
  // Update prevDiaryRef when diary changes
  useEffect(() => {
    if (!isInitialRender.current) {
      prevDiaryRef.current = { ...diary };
    }
  }, [diary]);
  
  // Auto-save when content changes (with debounce)
  useEffect(() => {    
    // Skip if content is empty or on initial render
    if (!diary.content || isInitialRender.current) return;
    
    // Clear previous timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
      autoSaveTimerRef.current = null;
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [diary.content, autoSave]);
  
  // Auto-save when ratings change
  useEffect(() => {
     // Skip if ratings are empty or on initial render
    if (Object.keys(diary.ratings).length === 0 || isInitialRender.current) return;
    
    // Clear previous timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
      autoSaveTimerRef.current = null;
    }, 2000);
  }, [diary.ratings, autoSave]);

  const handleSave = () => {
    try {
      setDiary({
        ...diary
      });
      showAlert(i18n.t('common.success'), i18n.t('diary.saveSuccess'));
    } catch (error) {
      console.error('保存日记失败:', error);
      showAlert(i18n.t('diary.saveFailed'), i18n.t('diary.checkContent'));
    }
  };
  
  const handleContentChange = (text: string) => {
    setDiary({
      ...diary,
      content: text
    });
  };
  
  const handleRatingChange = (tag: string, value: number) => {
    setDiary({
      ...diary,
      content: diary.content || '', // Ensure content is never undefined
      ratings: {
        ...diary.ratings,
        [tag]: value
      }
    });
  };
  
  const handleRatingInputChange = (tag: string, valueText: string) => {
    const value = parseFloat(valueText);
    if (!isNaN(value) && value >= 0 && value <= 5) {
      setDiary({
        ...diary,
        content: diary.content || '', // Ensure content is never undefined
        ratings: {
          ...diary.ratings,
          [tag]: value
        }
      });
    }
  };
  
  // Format the last saved time for display
  const formattedLastSaved = lastSaved
    ? new Date(lastSaved).toLocaleTimeString()
    : i18n.t('diary.notSaved');
  
  return (
    <View style={[CommonStyles.container, { backgroundColor: '#F5F5DC' }]}>
      <Stack.Screen
        options={{
          title: i18n.t('diary.title'),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={{ paddingRight: 16 }}>
              <MaterialIcons name="check" size={28} color="#4CAF50" />
            </TouchableOpacity>
          )
        }}
      />
      
      <ScrollView style={{ flex: 1 }}>
        <View style={[CommonStyles.card, CommonStyles.diaryCard]}>
          <TextInput
            style={CommonStyles.diaryInput}
            multiline
            value={diary.content}
            onChangeText={handleContentChange}
            placeholder={i18n.t('diary.placeholder')}
            numberOfLines={10}
            textAlignVertical="top"
            testID="diary-content-input"
          />
        </View>
        
        <View style={[CommonStyles.card, { backgroundColor: '#FFFEF0' }]}>
          <Text style={CommonStyles.sectionTitle}>{i18n.t('diary.todayRating')}</Text>

          {/* Default rating */}
          <View style={CommonStyles.ratingItem}>
            <Text style={CommonStyles.ratingLabel}>{i18n.t('diary.todayRating')}</Text>
            <View style={CommonStyles.ratingControls}>
              <StarRating 
                rating={diary.ratings['今日评价'] || 0} 
                onRatingChange={(value) => handleRatingChange('今日评价', value)}
                size={24}
                maxStars={5}
              />
              <TextInput
                style={CommonStyles.ratingValue}
                value={(diary.ratings['今日评价'] || 0).toFixed(1)}
                onChangeText={(text) => handleRatingInputChange('今日评价', text)}
                keyboardType="decimal-pad"
                maxLength={3}
                testID="rating-input-今日评价"
              />
            </View>
          </View>
          
          {/* Custom ratings from settings */}
          {settings.diary.customDiaryTags.map((tag, index) => (
            <View key={index} style={CommonStyles.ratingItem}>
              <Text style={CommonStyles.ratingLabel}>{tag}</Text>
              <View style={CommonStyles.ratingControls}>
                <StarRating 
                  rating={diary.ratings[tag] || 0} 
                  onRatingChange={(value) => handleRatingChange(tag, value)}
                  size={24}
                  maxStars={5}
                />
                <TextInput
                  style={CommonStyles.ratingValue}
                  value={(diary.ratings[tag] || 0).toFixed(1)}
                  onChangeText={(text) => handleRatingInputChange(tag, text)}
                  keyboardType="decimal-pad"
                  maxLength={3}
                  testID={`rating-input-${tag}`}
                />
              </View>
            </View>
          ))}
        </View>
        
        <Text style={CommonStyles.lastSavedText}>
          {i18n.t('diary.lastSaved')}: {formattedLastSaved}
        </Text>
      </ScrollView>
    </View>
  );
}

// 在文件底部添加本地样式定义，但尽量使用 CommonStyles
const styles = {
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  ratingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    marginLeft: 8,
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  }
}