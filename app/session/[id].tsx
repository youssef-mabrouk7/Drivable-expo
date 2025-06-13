import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  MapPin,
  User,
} from "lucide-react-native";
import { useSessionStore } from "@/store/SessionStore";
import { sessionsAPI } from "@/services/api";
import { Button } from "@/components/Button";
import { Session } from "@/types";
import { colors } from "@/constants/colors";

export default function SessionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { sessions, getSessionById } = useSessionStore();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const session = getSessionById(id);
    session?.then((data) => {
      setSession(data);
    });
    setIsLoading(false);
  }, [id]);

  const handleRegister = async () => {
    if (!session) return;

    setIsRegistering(true);
    try {
      await sessionsAPI.registerForSession(session.id);

      Alert.alert(
        "Registration Successful!",
        "You have been successfully registered for this session.",
        [
          {
            text: "View My Sessions",
            onPress: () => router.push("/(tabs)/sessions" as any),
          },
          {
            text: "OK",
            style: "default",
          },
        ],
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error instanceof Error
          ? error.message
          : "Failed to register for session. Please try again.",
      );
    } finally {
      setIsRegistering(false);
    }
  };

  // Check if user is registered for this session

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return colors.success;
      case "MEDIUM":
        return colors.secondary;
      case "HARD":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Loading..." }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading session details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Session Not Found" }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sessionDate = new Date(session.date);
  const formattedDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: session.scenario?.name || "Session Details",
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with scenario name and difficulty */}
        <View style={styles.headerCard}>
          <Text style={styles.sessionTitle}>
            {session.scenario?.name || "Driving Session"}
          </Text>
          {session.scenario && (
            <View
              style={[styles.difficultyBadge, {
                backgroundColor:
                  getDifficultyColor(session.scenario.difficulty) + "20",
              }]}
            >
              <Text
                style={[styles.difficultyText, {
                  color: getDifficultyColor(session.scenario.difficulty),
                }]}
              >
                {session.scenario.difficulty}
              </Text>
            </View>
          )}
        </View>

        {/* Session Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Session Details</Text>

          <View style={styles.detailRow}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formattedTime}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {session.location || "Location TBD"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {session.duration_minutes} minutes
              </Text>
            </View>
          </View>

          {session.price && (
            <View style={styles.detailRow}>
              <DollarSign size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>${session.price}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Scenario Information */}
        {session.scenario && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Scenario Information</Text>

            <View style={styles.detailRow}>
              <Car size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Environment</Text>
                <Text style={styles.detailValue}>
                  {session.scenario.environmentType}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Info size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Scenario ID</Text>
                <Text style={styles.detailValue}>
                  #{session.scenario.scenarioID}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Information */}
        {(session.topic || session.notes) && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            {session.topic && (
              <View style={styles.detailRow}>
                <Info size={20} color={colors.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Topic</Text>
                  <Text style={styles.detailValue}>{session.topic}</Text>
                </View>
              </View>
            )}

            {session.notes && (
              <View style={styles.detailRow}>
                <Info size={20} color={colors.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={styles.detailValue}>{session.notes}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Register or Cancel Button */}
      <View style={styles.footer}>
        <Button
          title="Register for Session"
          variant="primary"
          size="large"
          loading={isRegistering}
          onPress={handleRegister}
          icon={<CheckCircle size={20} color="white" />}
        />
      </View>
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
    paddingBottom: 100, // Space for footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
});

