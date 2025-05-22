import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Plus, Search } from "lucide-react-native";
import { useLessonStore } from "@/store/LessonStore";
import { useUserStore } from "@/store/userStore";
import { LessonCard } from "@/components/LessonCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { upcomingLessons, fetchLessons, isLoading } = useLessonStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleBookLesson = () => {
    router.push("/booking/new");
  };

  const handleViewSchedule = () => {
    router.push("/schedule");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>
              {user?.name?.split(" ")[0] || "Driver"}
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
            placeholder="Search lessons..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Upcoming events section */}
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>Upcoming Lessons</Text>
        </View>

        <View style={styles.schoolInfo}>
          <Text style={styles.schoolName}>Driving School</Text>
          <View style={styles.schoolDetails}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.white} />
              <Text style={styles.detailText}>Location</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color={colors.white} />
              <Text style={styles.detailText}>Duration</Text>
            </View>
          </View>
        </View>

        {isLoading
          ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your lessons...</Text>
            </View>
          )
          : upcomingLessons
          ? (
            upcomingLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))
          )
          : (
            <EmptyState
              title="No upcoming lessons"
              description="Book your first driving lesson to start your journey to becoming a confident driver."
              icon={<Calendar size={48} color={colors.textSecondary} />}
              actionLabel="Book a Lesson"
              onAction={handleBookLesson}
            />
          )}
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleBookLesson}
      >
        <Calendar size={24} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const MapPin = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, marginRight: 4 }}>
    <View style={[styles.mapPin, { backgroundColor: color }]} />
  </View>
);

const Clock = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, marginRight: 4 }}>
    <View style={[styles.clock, { borderColor: color }]} />
  </View>
);

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
  mapPin: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  clock: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
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

