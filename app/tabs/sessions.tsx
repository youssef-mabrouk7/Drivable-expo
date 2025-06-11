import React, { useEffect } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistrationStore } from "@/store/RegistrationStore";
import { SessionCard } from "@/components/SessionCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { Calendar } from "lucide-react-native";
import { registrationsAPI } from "@/services/api";

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
      console.error("Error refreshing registrations:", error);
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    await registrationsAPI.cancelRegistration(registrationId);
    Alert.alert(
      "Cancel Registration",
      "Are you sure you want to cancel this registration?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelRegistration(registrationId);
              Alert.alert(
                "Success",
                "Registration cancelled successfully",
                [{ text: "OK" }],
              );
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to cancel registration. Please try again.",
                [{ text: "OK" }],
              );
            }
          },
        },
      ],
    );
  };

  // Use registrations directly since server response already has correct structure
  const registrationsList = Array.isArray(registrations) ? registrations : [];

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
            {registrationsList.length}{" "}
            session{registrationsList.length !== 1 ? "s" : ""} registered
          </Text>
        </View>

        {registrationsList.length === 0
          ? (
            <EmptyState
              icon={<Calendar size={48} color={colors.textSecondary} />}
              title="No Sessions Yet"
              description="You haven't registered for any sessions yet. Browse available sessions to get started!"
            />
          )
          : (
            <View style={styles.sessionsContainer}>
              {registrationsList.map((registration) => (
                <View key={registration.id} style={styles.sessionWrapper}>
                  <SessionCard
                    session={registration.session!}
                    registration={registration}
                    onCancel={handleCancelRegistration}
                  />
                  {/* Add registration status info */}
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                      Status:{" "}
                      {registration.completed ? "Completed" : "Upcoming"}
                    </Text>
                    <Text style={styles.statusText}>
                      Payment: {registration.paid ? "Paid" : "Pending"}
                    </Text>
                    {registration.score && registration.score > 0 && (
                      <Text style={styles.statusText}>
                        Score: {registration.score}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
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
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sessionsContainer: {
    gap: 16,
  },
  sessionWrapper: {
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
  },
});
