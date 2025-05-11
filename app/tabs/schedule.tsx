import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, Plus, Clock } from 'lucide-react-native';
import { useLessonStore } from '@/store/LessonStore';
import { LessonCard } from '@/components/LessonCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';

type TabType = 'upcoming' | 'past';

export default function ScheduleScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { upcomingLessons, pastLessons, fetchLessons, isLoading } = useLessonStore();
  
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);
  
  const handleBookLesson = () => {
    router.push('/booking/new');
  };
  
  const renderLessons = () => {
    const lessons = activeTab === 'upcoming' ? upcomingLessons : pastLessons;
    
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your lessons...</Text>
        </View>
      );
    }
    
    if (lessons.length === 0) {
      return (
        <EmptyState
          title={activeTab === 'upcoming' ? "No upcoming lessons" : "No past lessons"}
          description={
            activeTab === 'upcoming'
              ? "You don't have any upcoming lessons scheduled. Book a lesson to get started."
              : "You haven't completed any lessons yet. Your history will appear here after your first lesson."
          }
          icon={<Calendar size={48} color={colors.textSecondary} />}
          actionLabel={activeTab === 'upcoming' ? "Book a Lesson" : undefined}
          onAction={activeTab === 'upcoming' ? handleBookLesson : undefined}
        />
      );
    }
    
    return lessons.map((lesson) => (
      <LessonCard key={lesson.id} lesson={lesson} />
    ));
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Schedule</Text>
        <Button
          title="Book"
          variant="primary"
          size="small"
          icon={<Plus size={16} color="white" />}
          onPress={handleBookLesson}
        />
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderLessons()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});