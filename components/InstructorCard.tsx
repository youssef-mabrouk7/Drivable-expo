import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Star, Calendar } from 'lucide-react-native';
import { Instructor } from '@/types';
import { colors } from '@/constants/colors';

type InstructorCardProps = {
  instructor: Instructor;
  selected?: boolean;
  onSelect?: (instructorId: string) => void;
};

export const InstructorCard = ({ 
  instructor, 
  selected = false,
  onSelect 
}: InstructorCardProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        selected && styles.selectedContainer
      ]} 
      onPress={() => onSelect?.(instructor.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: instructor.avatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{instructor.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.rating}>{instructor.rating}</Text>
            <Text style={styles.reviews}>({instructor.reviews} reviews)</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.experience}>{instructor.experience} experience</Text>
        
        <View style={styles.specialtiesContainer}>
          {instructor.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.bio} numberOfLines={2}>{instructor.bio}</Text>
      </View>
      
      <View style={styles.footer}>
        <Calendar size={14} color={colors.textSecondary} />
        <Text style={styles.availability}>
          Available: {instructor.availability.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }
    }),
  },
  selectedContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  content: {
    marginBottom: 12,
  },
  experience: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  specialtyBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  availability: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});