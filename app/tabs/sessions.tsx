import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, CheckCircle, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useRegistrationStore } from "@/store/RegistrationStore";
import { useUserStore } from "@/store/userStore";
import { SessionCard } from "@/components/SessionCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { Registration } from "@/types";

export default function SessionsScreen() {
  const router = useRouter();
  const { 
    registrations, 
    fetchUserRegistrations, 
    isLoading, 
    error,
    clearError
  } = useRegistrationStore();

  const { isAuthenticated, checkAuthStatus } = useUserStore();

  useEffect(() => {
    const initializeScreen = async () => {
      // Check authentication status first
      const isAuth = await checkAuthStatus();
      if (!isAuth) {
        router.replace("/auth/login");
        return;
      }
      
      // If authenticated, fetch registrations
      fetchUserRegistrations();
    };

    initializeScreen();
  }, [fetchUserRegistrations, checkAuthStatus, router]);

  useEffect(() => {
    if (error) {
      // If we get a 403 or authentication error, redirect to login
      if (error.includes("403") || error.includes("Unauthorized") || error.includes("authentication")) {
        router.replace("/auth/login");
        return;
      }
      
      // Clear error after showing it
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError, router]);

  const isSessionCompleted = (registration: Registration): boolean => {
    if (!registration.session?.datetime) return false;
    const sessionDate = new Date(registration.session.datetime);
    const now = new Date();
    return sessionDate < now;
  };

  const getStatusDisplay = (registration: Registration) => {
    const completed = isSessionCompleted(registration);
    
    if (completed) {
      return {
        icon: <CheckCircle size={16} color={colors.success} />,
        text: "Completed",
        textColor: colors.success,
        backgroundColor: colors.success + "20"
      };
    } else {
      return {
        icon: <Clock size={16} color={colors.primary} />,
        text: "Scheduled",
        textColor: colors.primary,
        backgroundColor: colors.primary + "20"
      };
    }
  };

  const renderSessions = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your sessions...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={async () => {
              // Check auth before retrying
              const isAuth = await checkAuthStatus();
              if (!isAuth) {
                router.replace("/auth/login");
                return;
              }
              fetchUserRegistrations();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!registrations || registrations.length === 0) {
      return (
        <EmptyState
          title="No sessions found"
          description="You don't have any registered sessions yet. Book a session to get started!"
          icon={<Calendar size={48} color={colors.textSecondary} />}
        />
      );
    }

    // Filter registrations that have session data
    const registrationsWithSessions = registrations.filter(registration => registration.session);

    // If no registrations have session data, show a different message
    if (registrationsWithSessions.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Found {registrations.length} registrations but no session data loaded.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchUserRegistrations}
          >
            <Text style={styles.retryButtonText}>Retry Loading Sessions</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Sort registrations by session date (most recent first)
    const sortedRegistrations = [...registrationsWithSessions].sort((a, b) => {
      if (!a.session?.datetime || !b.session?.datetime) return 0;
      return new Date(b.session.datetime).getTime() - new Date(a.session.datetime).getTime();
    });

    return sortedRegistrations.map((registration) => {
      const status = getStatusDisplay(registration);
      
      return (
        <View key={registration.id} style={styles.sessionContainer}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
              {status.icon}
              <Text style={[styles.statusText, { color: status.textColor }]}>
                {status.text}
              </Text>
            </View>
          </View>
          <SessionCard session={registration.session!} />
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Sessions</Text>
        <Text style={styles.subtitle}>
          {registrations.length} session{registrations.length !== 1 ? 's' : ''} registered
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSessions()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  sessionContainer: {
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    padding: 24,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

