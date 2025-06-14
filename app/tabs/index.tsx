import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSessionStore } from "@/store/SessionStore";
import { useUserStore } from "@/store/userStore";
import { colors } from "@/constants/colors";
import { SessionCard } from "@/components/SessionCard";
import { Search } from "lucide-react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { sessions, fetchSessions, isLoading } = useSessionStore();
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCreateSession = () => {
    router.push("/(session)/create" as any);
  };

  const filteredSessions = sessions.filter((session) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (session.scenario?.name || "").toLowerCase().includes(searchLower) ||
      (session.topic || "").toLowerCase().includes(searchLower) ||
      (session.location || "").toLowerCase().includes(searchLower) ||
      (session.notes || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Sessions</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateSession}
        >
          <Text style={styles.createButtonText}>Create Session</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sessions..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchSessions}
            colors={[colors.primary]}
            tintColor={colors.text}
          />
        }
      >
        {filteredSessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No sessions found matching your search"
                : "No sessions available at the moment"}
            </Text>
          </View>
        ) : (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
