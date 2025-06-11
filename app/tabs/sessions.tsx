import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistrationStore } from '@/store/RegistrationStore';
import { SessionCard } from '@/components/SessionCard';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { Calendar } from 'lucide-react-native';

export default function SessionsScreen() {
  const {
    registrations,
    isLoading,
    error,
    fetchUserRegistrations,
    cancelRegistration,
    clearError,
  } = useRegistrationStore();

  useEffect(() => {
    fetchUserRegistrations();
  }, []);

  const handleRefresh = async () => {
    try {
      await fetchUserRegistrations();
    } catch (error) {
      console.error('Error refreshing registrations:', error);
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    Alert.alert(
      'Cancel Registration',
      'Are you sure you want to cancel this registration?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelRegistration(registrationId);
              Alert.alert(
                'Success',
                'Registration cancelled successfully',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'Failed to cancel registration. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  // Separate upcoming and past sessions
  const now = new Date();
  const upcomingSessions = registrations.filter(
    (registration) =>
      registration.session && new Date(registration.session.datetime) > now
  );
  const pastSessions = registrations.filter(
    (registration) =>
      registration.session && new Date(registration.session.datetime) <= now
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Sessions</Text>
          <Text style={styles.subtitle}>
            {registrations.length} session{registrations.length !== 1 ? 's' : ''} registered
          </Text>
        </View>

        {registrations.length === 0 ? (
          <EmptyState
            icon={<Calendar size={48} color={colors.textSecondary} />}
            title="No Sessions Yet"
            description="You haven't registered for any sessions yet. Browse available sessions to get started!"
          />
        ) : (
          <>
            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                </View>
                {upcomingSessions.map((registration) => (
                  <SessionCard
                    key={registration.id}
                    session={registration.session!}
                    registration={registration}
                    onCancel={handleCancelRegistration}
                  />
                ))}
              </>
            )}

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Past Sessions</Text>
                </View>
                {pastSessions.map((registration) => (
                  <SessionCard
                    key={registration.id}
                    session={registration.session!}
                    registration={registration}
                  />
                ))}
              </>
            )}
          </>
        )}
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
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});