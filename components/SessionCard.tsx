import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar, Car, Clock, MapPin } from "lucide-react-native";
import { Registration, Session } from "@/types";
import { colors } from "@/constants/colors";

interface SessionCardProps {
  session: Session;
  registration?: Registration;
  onCancel?: (registrationId: string) => void;
}

export function SessionCard(
  { session, registration, onCancel }: SessionCardProps,
) {
  const router = useRouter();
  let sessionDate: Date | null = null;
  let formattedDate = "TBD";
  let formattedTime = "TBD";
  if (session.date) {
    const d = new Date(session.date);
    if (!isNaN(d.getTime())) {
      sessionDate = d;
      formattedDate = d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      formattedTime = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

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

  const handlePress = () => {
    router.push({
      pathname: "/session/[id]",
      params: { id: session.id },
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.scenarioName}>
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
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.primary} />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.infoText}>{formattedTime}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.infoText}>
            {session.location || "Location TBD"}
          </Text>
        </View>

        {session.scenario && (
          <View style={styles.infoRow}>
            <Car size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {session.scenario.environmentType}
            </Text>
          </View>
        )}

        {session.scenario && (
          <Text style={styles.scenarioId}>
            Scenario #{session.scenario.scenarioID}
          </Text>
        )}

        {registration && onCancel && sessionDate && sessionDate > new Date() &&
          (
            <TouchableOpacity
              style={{
                marginTop: 8,
                backgroundColor: colors.error,
                padding: 10,
                borderRadius: 8,
              }}
              onPress={() => onCancel(registration.id)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Cancel Registration
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  scenarioId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
