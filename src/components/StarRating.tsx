import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  size = 24, 
  maxStars = 5 
}) => {
  // Handle star press with precise positions
  const handleStarPress = (starIndex: number) => {
    // If clicking on the current full star, make it a half star
    if (Math.floor(rating) === starIndex && rating === starIndex) {
      onRatingChange(starIndex - 0.5);
    } 
    // If clicking on a star that's already half, make it full
    else if (Math.floor(rating) === starIndex - 1 && rating === starIndex - 0.5) {
      onRatingChange(starIndex);
    }
    // Otherwise just set to the clicked star
    else {
      onRatingChange(starIndex);
    }
  };
  
  // Convert rating to array of filled stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= maxStars; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <TouchableOpacity
            key={i}
            onPress={() => handleStarPress(i)}
            style={styles.starContainer}
            testID={`star-button-${i}`}
          >
            <MaterialIcons name="star" size={size} color="#FFD700" />
          </TouchableOpacity>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <TouchableOpacity
            key={i}
            onPress={() => handleStarPress(i)}
            style={styles.starContainer}
            testID={`star-button-${i}`}
          >
            <MaterialIcons name="star-half" size={size} color="#FFD700" />
          </TouchableOpacity>
        );
      } else {
        // Empty star
        stars.push(
          <TouchableOpacity
            key={i}
            onPress={() => handleStarPress(i)}
            style={styles.starContainer}
            testID={`star-button-${i}`}
          >
            <MaterialIcons name="star-outline" size={size} color="#FFD700" />
          </TouchableOpacity>
        );
      }
    }
    
    return stars;
  };
  
  return (
    <View style={styles.container} testID="star-rating-container">
      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    padding: 2, // Add padding for better touch area
  }
});

export default StarRating;

