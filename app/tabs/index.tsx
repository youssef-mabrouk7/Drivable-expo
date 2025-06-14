import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Clock, MapPin, Plus, Search } from "lucide-react-native";
import { useSessionStore } from "@/store/SessionStore";
import { useUserStore } from "@/store/userStore";
import { SessionCard } from "@/components/SessionCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { useThemeStore } from "@/store/themeStore";

export default function HomeScreen() {
  const router = useRouter();
  const { sessions, fetchSessions, isLoading } = useSessionStore();
  const { user } = useUserStore();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
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
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={isDarkMode ? colors.textDark : colors.text}
          />
        }
      >
        {/* Header with greeting */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, isDarkMode && styles.darkText]}>Welcome back,</Text>
            <Text style={[styles.name, isDarkMode && styles.darkText]}>
              {user?.firstName?.split(" ")[0] || "Driver"}
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Dr</Text>
          </View>
        </View>

        {/* Search bar */}
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

        {/* Available sessions section */}
        <View style={styles.eventsHeader}>
          <Text style={[styles.eventsTitle, isDarkMode && styles.darkText]}>Available Sessions</Text>
          <Text style={[styles.eventsSubtitle, isDarkMode && styles.darkText]}>
            {filteredSessions.length} session
            {filteredSessions.length !== 1 ? "s" : ""} available
          </Text>
        </View>

        <View style={styles.schoolInfo}>
          <Text style={[styles.schoolName, isDarkMode && styles.darkText]}>Driving Sessions</Text>
          <View style={styles.schoolDetails}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.white} />
              <Text style={[styles.detailText, isDarkMode && styles.darkText]}>Various Locations</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color={colors.white} />
              <Text style={[styles.detailText, isDarkMode && styles.darkText]}>Multiple Durations</Text>
            </View>
          </View>
        </View>

        {isLoading
          ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
                Loading available sessions...
              </Text>
            </View>
          )
          : filteredSessions.length > 0
            ? (
              filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                />
              ))
            )
            : (
              <EmptyState
                title={searchQuery
                  ? "No sessions found"
                  : "No sessions available"}
                description={searchQuery
                  ? "Try adjusting your search terms to find sessions."
                  : "No driving sessions are currently available. Check back later for new sessions."}
                icon={<Calendar size={48} color={colors.textSecondary} />}
                actionLabel="Book a Session"
                onAction={handleCreateSession}
              />
            )}
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateSession}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  darkText: {
    color: colors.textDark,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
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
  darkSearchContainer: {
    backgroundColor: colors.cardDark,
    borderColor: colors.borderDark,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  darkSearchInput: {
    color: colors.textDark,
  },
  eventsHeader: {
    backgroundColor: colors.primary,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  eventsTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  eventsSubtitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
    opacity: 0.9,
  },
  schoolInfo: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
  },
  schoolName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  schoolDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    color: colors.white,
    fontSize: 14,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
