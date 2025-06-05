import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Diary } from '../../src/models/types';
import StarRating from '../../src/components/StarRating';
import { showAlert } from '../../src/utils/alertUtils';
import { generateDiaryTemplate } from '../../src/utils/diaryUtils';

export default function DiaryScreen() {
  const { diary, settings, setDiary, lastSaved } = useTodoStore();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialRender = useRef(true);
  const prevDiaryRef = useRef<Diary | null>(null);
  
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
      showAlert('保存成功', '日记已保存');
    } catch (error) {
      console.error('保存日记失败:', error);
      showAlert('保存失败', '请检查输入内容是否正确');
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
    : '未保存';
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: '日记',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={{ paddingRight: 16 }}>
              <MaterialIcons name="check" size={28} color="#4CAF50" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.diaryContainer}>
          <TextInput
            style={styles.diaryInput}
            multiline
            value={diary.content}
            onChangeText={handleContentChange}
            placeholder="今天的日记..."
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.ratingsContainer}>
          <Text style={styles.ratingsTitle}>今日评价</Text>
          
          {/* Default rating */}
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>今日评价</Text>
            <View style={styles.ratingControls}>
              <StarRating 
                rating={diary.ratings['今日评价'] || 0} 
                onRatingChange={(value) => handleRatingChange('今日评价', value)}
                size={24}
                maxStars={5}
              />
              <TextInput
                style={styles.ratingValue}
                value={(diary.ratings['今日评价'] || 0).toFixed(1)}
                onChangeText={(text) => handleRatingInputChange('今日评价', text)}
                keyboardType="decimal-pad"
                maxLength={3}
              />
            </View>
          </View>
          
          {/* Custom ratings from settings */}
          {settings.diary.customDiaryTags.map((tag, index) => (
            <View key={index} style={styles.ratingItem}>
              <Text style={styles.ratingLabel}>{tag}</Text>
              <View style={styles.ratingControls}>
                <StarRating 
                  rating={diary.ratings[tag] || 0} 
                  onRatingChange={(value) => handleRatingChange(tag, value)}
                  size={24}
                  maxStars={5}
                />
                <TextInput
                  style={styles.ratingValue}
                  value={(diary.ratings[tag] || 0).toFixed(1)}
                  onChangeText={(text) => handleRatingInputChange(tag, text)}
                  keyboardType="decimal-pad"
                  maxLength={3}
                />
              </View>
            </View>
          ))}
        </View>
        
        <Text style={styles.lastSavedText}>
          上次保存: {formattedLastSaved}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige color for diary feel
  },
  scrollContainer: {
    flex: 1,
  },
  diaryContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFEF0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 300,
  },
  diaryInput: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlignVertical: 'top',
    height: 300,
  },
  ratingsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFEF0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  ratingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  lastSavedText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  })
