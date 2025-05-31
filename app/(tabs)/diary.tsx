import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTodoStore } from '../../src/store/useTodoStore';
import { Diary } from '../../src/models/types';
import StarRating from '../../src/components/StarRating';

export default function DiaryScreen() {
  const { diary, settings, setDiary } = useTodoStore();
  const [content, setContent] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [weather, setWeather] = useState('');
  const [lastSaved, setLastSaved] = useState(new Date());
  
  // Initialize diary content with template
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const template = settings.diary.diaryTemplate === 'simple' ? 
      `${today}\t天气：${weather}\n\n完成事项：\n\n心得体会：\n` : 
      settings.diary.diaryTemplate.replace('{日期}', today).replace('{天气}', weather);
    
    if (!diary.content) {
      setContent(template);
    } else {
      setContent(diary.content);
    }
    
    // Initialize ratings
    const initialRatings: Record<string, number> = {};
    initialRatings['今日评价'] = diary.ratings['今日评价'] || 0;
    
    // Add custom tags from settings
    settings.diary.customDiaryTags.forEach(tag => {
      initialRatings[tag] = diary.ratings[tag] || 0;
    });
    
    setRatings(initialRatings);
  }, [diary, settings.diary.diaryTemplate]);
  
  // Auto-save function
  const autoSave = useCallback(() => {
    try {
      const updatedDiary: Diary = {
        date: new Date().toISOString().split('T')[0],
        content: content,
        ratings: ratings
      };
      setDiary(updatedDiary);
      setLastSaved(new Date());
      console.log('Auto-saved diary at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [content, ratings, setDiary]);
  
  // Auto-save when content changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 2000); // Auto-save 2 seconds after typing stops
    
    return () => clearTimeout(timer);
  }, [content, autoSave]);
  
  // Auto-save when ratings change
  useEffect(() => {
    // Skip the initial render
    if (lastSaved.getTime() === 0) return;
    
    autoSave();
  }, [ratings, autoSave]);
  
  const handleSave = () => {
    try {
      const updatedDiary: Diary = {
        date: new Date().toISOString().split('T')[0],
        content: content,
        ratings: ratings
      };
      setDiary(updatedDiary);
      setLastSaved(new Date());
      Alert.alert('保存成功', '日记已保存');
    } catch (error) {
      console.error('保存日记失败:', error);
      Alert.alert('保存失败', '请检查输入内容是否正确');
    }
  };
  
  const handleRatingChange = (tag: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [tag]: value
    }));
  };
  
  const handleRatingInputChange = (tag: string, valueText: string) => {
    const value = parseFloat(valueText);
    if (!isNaN(value) && value >= 0 && value <= 5) {
      setRatings(prev => ({
        ...prev,
        [tag]: value
      }));
    }
  };
  
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
            value={content}
            onChangeText={setContent}
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
                rating={ratings['今日评价'] || 0} 
                onRatingChange={(value) => handleRatingChange('今日评价', value)}
                size={24}
                maxStars={5}
              />
              <TextInput
                style={styles.ratingValue}
                value={ratings['今日评价']?.toFixed(1) || '0.0'}
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
                  rating={ratings[tag] || 0} 
                  onRatingChange={(value) => handleRatingChange(tag, value)}
                  size={24}
                  maxStars={5}
                />
                <TextInput
                  style={styles.ratingValue}
                  value={ratings[tag]?.toFixed(1) || '0.0'}
                  onChangeText={(text) => handleRatingInputChange(tag, text)}
                  keyboardType="decimal-pad"
                  maxLength={3}
                />
              </View>
            </View>
          ))}
        </View>
        
        <Text style={styles.lastSavedText}>
          上次保存: {lastSaved.toLocaleTimeString()}
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
