import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistrationStore } from "@/store/RegistrationStore";
import { SessionCard } from "@/components/SessionCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { Calendar, Search } from "lucide-react-native";
import { registrationsAPI } from "@/services/api";
import { useThemeStore } from "@/store/themeStore";

export default function SessionsScreen() {
  const {
    registrations,
    isLoading,
    error,
    fetchUserRegistrations,
    cancelRegistration,
    clearError,
  } = useRegistrationStore();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUserRegistrations();
  }, []);

  const handleRefresh = async () => {
    try {
      await fetchUserRegistrations();
    } catch (error) {
      // Error is already handled by the store
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
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
              await registrationsAPI.cancelRegistration(registrationId);
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

  // Filter registrations based on search query
  const filteredRegistrations = registrations.filter((registration) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      registration.session?.title?.toLowerCase().includes(searchLower) ||
      registration.session?.description?.toLowerCase().includes(searchLower) ||
      registration.session?.instructor?.name?.toLowerCase().includes(searchLower)
    );
  });

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
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>My Sessions</Text>
          <Text style={[styles.subtitle, isDarkMode && styles.darkTextSecondary]}>
            {filteredRegistrations.length} session{filteredRegistrations.length !== 1 ? "s" : ""} registered
          </Text>
        </View>

        <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
          <Search size={20} color={isDarkMode ? colors.textSecondaryDark : colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder="Search sessions..."
            placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {filteredRegistrations.length === 0 ? (
          <EmptyState
            icon={<Calendar size={48} color={isDarkMode ? colors.textSecondaryDark : colors.textSecondary} />}
            title="No Sessions Found"
            description={searchQuery ? "No sessions match your search" : "You haven't registered for any sessions yet. Browse available sessions to get started!"}
          />
        ) : (
          <View style={styles.sessionsContainer}>
            {filteredRegistrations.map((registration) => (
              <View key={registration.id} style={styles.sessionWrapper}>
                <SessionCard
                  session={registration.session!}
                  registration={registration}
                  onCancel={handleCancelRegistration}
                />
                <View style={[styles.statusContainer, isDarkMode && styles.darkStatusContainer]}>
                  <Text style={[styles.statusText, isDarkMode && styles.darkTextSecondary]}>
                    <Text>Status: </Text>
                    <Text>{registration.completed ? "Completed" : "Upcoming"}</Text>
                  </Text>
                  <Text style={[styles.statusText, isDarkMode && styles.darkTextSecondary]}>
                    <Text>Payment: </Text>
                    <Text>{registration.paid ? "Paid" : "Pending"}</Text>
                  </Text>
                  {registration.score && registration.score > 0 && (
                    <Text style={[styles.statusText, isDarkMode && styles.darkTextSecondary]}>
                      <Text>Score: </Text>
                      <Text>{registration.score}</Text>
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
  darkContainer: {
    backgroundColor: colors.backgroundDark,
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
  darkText: {
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  darkTextSecondary: {
    color: colors.textSecondaryDark,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  darkSearchContainer: {
    backgroundColor: colors.cardDark,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  darkSearchInput: {
    color: colors.textDark,
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
  darkStatusContainer: {
    backgroundColor: colors.cardDark,
    borderColor: colors.borderDark,
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
