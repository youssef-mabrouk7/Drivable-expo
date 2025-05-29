import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, MapPin, Car } from "lucide-react-native";
import { Session } from "@/types";
import { colors } from "@/constants/colors";

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const sessionDate = new Date(session.date);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return colors.success;
      case 'MEDIUM':
        return colors.warning;
      case 'HARD':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Car size={20} color={colors.primary} />
          <Text style={styles.scenarioName}>{session.scenario.name}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(session.scenario.difficulty) }]}>
          <Text style={styles.difficultyText}>{session.scenario.difficulty}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {sessionDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{session.location}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.environmentBadge}>
          <Text style={styles.environmentText}>
            {session.scenario.environmentType}
          </Text>
        </View>
        <Text style={styles.scenarioId}>
          Scenario #{session.scenario.scenarioID}
        </Text>
      </View>
    </View>
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
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  environmentBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  environmentText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  scenarioId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
}); 