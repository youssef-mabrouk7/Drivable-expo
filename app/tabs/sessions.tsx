import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "lucide-react-native";
import { useSessionStore } from "@/store/SessionStore";
import { SessionCard } from "@/components/SessionCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { Session } from "@/types";

type TabType = "upcoming" | "past";

export default function SessionsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const { sessions, fetchSessions, isLoading } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filterSessions = (sessions: Session[]) => {
    const now = new Date();
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return activeTab === "upcoming"
        ? sessionDate >= now
        : sessionDate < now;
    });
  };

  const renderSessions = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your sessions...</Text>
        </View>
      );
    }

    const filteredSessions = filterSessions(sessions);

    if (!filteredSessions || filteredSessions.length === 0) {
      return (
        <EmptyState
          title={activeTab === "upcoming"
            ? "No upcoming sessions"
            : "No past sessions"}
          description={activeTab === "upcoming"
            ? "You don't have any upcoming sessions scheduled."
            : "You haven't completed any sessions yet. Your history will appear here after your first session."}
          icon={<Calendar size={48} color={colors.textSecondary} />}
        />
      );
    }

    return filteredSessions.map((session) => (
      <SessionCard key={session.id} session={session} />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Sessions</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
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
    paddingTop: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
}); 