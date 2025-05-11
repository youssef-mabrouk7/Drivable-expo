import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Car 
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { useLessonStore } from '@/store/LessonStore';
import { colors } from '@/constants/colors';

export default function ProgressScreen() {
  const { user } = useUserStore();
  const { pastLessons } = useLessonStore();
  
  // Calculate total hours driven
  const totalMinutesDriven = pastLessons.reduce(
    (total, lesson) => total + lesson.duration,
    0
  );
  const totalHoursDriven = Math.floor(totalMinutesDriven / 60);
  const remainingMinutes = totalMinutesDriven % 60;
  
  // Calculate average rating
  const lessonsWithRatings = pastLessons.filter(lesson => lesson.rating);
  const averageRating = lessonsWithRatings.length > 0
    ? lessonsWithRatings.reduce((sum, lesson) => sum + (lesson.rating || 0), 0) / lessonsWithRatings.length
    : 0;
  
  // Skills progress (mock data)
  const skills = [
    { name: 'Basic Vehicle Control', progress: 0.9 },
    { name: 'Parking', progress: 0.7 },
    { name: 'Highway Driving', progress: 0.5 },
    { name: 'City Navigation', progress: 0.8 },
    { name: 'Night Driving', progress: 0.3 },
    { name: 'Defensive Driving', progress: 0.6 },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'My Progress',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: {
            color: colors.white,
          },
          headerTintColor: colors.white,
        }} 
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Clock size={24} color={colors.primary} />
            <Text style={styles.statValue}>
              {totalHoursDriven}h {remainingMinutes}m
            </Text>
            <Text style={styles.statLabel}>Total Driving Time</Text>
          </View>
          
          <View style={styles.statCard}>
            <CheckCircle size={24} color={colors.primary} />
            <Text style={styles.statValue}>{pastLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Award size={24} color={colors.primary} />
            <Text style={styles.statValue}>
              {averageRating.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Skills Progress</Text>
        </View>
        
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillPercent}>
                  {Math.round(skill.progress * 100)}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${skill.progress * 100}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>License Requirements</Text>
        </View>
        
        <View style={styles.requirementsContainer}>
          <View style={styles.requirementItem}>
            <View style={styles.requirementIconContainer}>
              <CheckCircle size={20} color={colors.success} />
            </View>
            <View style={styles.requirementInfo}>
              <Text style={styles.requirementTitle}>Written Test</Text>
              <Text style={styles.requirementDescription}>
                Completed on June 15, 2023
              </Text>
            </View>
          </View>
          
          <View style={styles.requirementItem}>
            <View style={styles.requirementIconContainer}>
              <AlertCircle size={20} color={colors.secondary} />
            </View>
            <View style={styles.requirementInfo}>
              <Text style={styles.requirementTitle}>Minimum Driving Hours</Text>
              <Text style={styles.requirementDescription}>
                {totalHoursDriven} of 50 hours completed
              </Text>
              <View style={styles.miniProgressContainer}>
                <View 
                  style={[
                    styles.miniProgress, 
                    { width: `${Math.min(totalHoursDriven / 50 * 100, 100)}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
          
          <View style={styles.requirementItem}>
            <View style={styles.requirementIconContainer}>
              <AlertCircle size={20} color={colors.secondary} />
            </View>
            <View style={styles.requirementInfo}>
              <Text style={styles.requirementTitle}>Night Driving Hours</Text>
              <Text style={styles.requirementDescription}>
                2 of 10 hours completed
              </Text>
              <View style={styles.miniProgressContainer}>
                <View 
                  style={[
                    styles.miniProgress, 
                    { width: '20%' }
                  ]} 
                />
              </View>
            </View>
          </View>
          
          <View style={styles.requirementItem}>
            <View style={styles.requirementIconContainer}>
              <AlertCircle size={20} color={colors.error} />
            </View>
            <View style={styles.requirementInfo}>
              <Text style={styles.requirementTitle}>Road Test</Text>
              <Text style={styles.requirementDescription}>
                Not scheduled yet
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  skillsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillItem: {
    marginBottom: 16,
  },
  skillInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    color: colors.text,
  },
  skillPercent: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  requirementsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  requirementIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requirementInfo: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  requirementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  miniProgressContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  miniProgress: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
});