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

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { sessions, fetchSessions, isLoading } = useSessionStore();
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

  const handleBookLesson = () => {
    router.push("/booking/new");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Search is already handled by the filteredSessions logic
      console.log("Searching for:", searchQuery);
    }
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;

    return (
      (session.scenario?.name || "").toLowerCase().includes(searchLower) ||
      (session.topic || "").toLowerCase().includes(searchLower) ||
      (session.location || "").toLowerCase().includes(searchLower) ||
      (session.notes || "").toLowerCase().includes(searchLower) ||
      (session.instructor?.firstName || "").toLowerCase().includes(searchLower) ||
      (session.instructor?.lastName || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header with greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>
              {user?.firstName?.split(" ")[0] || "Driver"}
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Dr</Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search sessions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Search size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Available sessions section */}
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>Available Sessions</Text>
          <Text style={styles.eventsSubtitle}>
            {filteredSessions.length} session
            {filteredSessions.length !== 1 ? "s" : ""} available
          </Text>
        </View>

        <View style={styles.schoolInfo}>
          <Text style={styles.schoolName}>Driving Sessions</Text>
          <View style={styles.schoolDetails}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.white} />
              <Text style={styles.detailText}>Various Locations</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color={colors.white} />
              <Text style={styles.detailText}>Multiple Durations</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Loading available sessions...
            </Text>
          </View>
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <EmptyState
            title={searchQuery ? "No sessions found" : "No sessions available"}
            description={
              searchQuery
                ? "Try adjusting your search terms to find sessions."
                : "No driving sessions are currently available. Check back later for new sessions."
            }
            icon={<Calendar size={48} color={colors.textSecondary} />}
            actionLabel="Book a Session"
            onAction={handleBookLesson}
          />
        )}
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={handleBookLesson}>
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
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
