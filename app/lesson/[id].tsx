import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  BookOpen,
  User,
} from "lucide-react-native";
import { useLessonStore } from "@/store/LessonStore";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { Lesson, Instructor } from "@/types";

export default function LessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { upcomingLessons, pastLessons, isLoading } = useLessonStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(false);

  useEffect(() => {
    // Find the lesson in either upcoming or past lessons
    const foundLesson = [...upcomingLessons, ...pastLessons].find(
      (lesson) => lesson.id.toString() === id,
    );

    if (foundLesson) {
      setLesson(foundLesson);
    }
  }, [id, upcomingLessons, pastLessons]);

  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoadingInstructors(true);
      try {
        const response = await fetch('YOUR_BACKEND_API_URL/instructors');
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setIsLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleBookLesson = async () => {
    if (!lesson) return;

    try {
      const response = await fetch('YOUR_BACKEND_API_URL/book-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          date: lesson.date,
          location: lesson.location,
          scenarioId: lesson.scenario.scenarioID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book lesson');
      }

      // Navigate to the sessions tab
      router.replace("/(tabs)/sessions" as any);
    } catch (error) {
      console.error("Error booking lesson:", error);
      // You might want to show an error message to the user here
    }
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Lesson Details" }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading lesson details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(lesson.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(lesson.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return colors.success;
      case 'MEDIUM':
        return colors.secondary;
      case 'HARD':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Lesson Details",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Car size={24} color={colors.primary} />
              <Text style={styles.title}>{lesson.scenario.name}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.scenario.difficulty) + "20" }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(lesson.scenario.difficulty) }]}>
                {lesson.scenario.difficulty}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.infoText}>{formattedTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.infoText}>{lesson.location}</Text>
          </View>

          <View style={styles.environmentContainer}>
            <Text style={styles.environmentLabel}>Environment Type:</Text>
            <View style={styles.environmentBadge}>
              <Text style={styles.environmentText}>{lesson.scenario.environmentType}</Text>
            </View>
          </View>
        </View>

        <Button
          title="Book This Lesson"
          variant="primary"
          icon={<BookOpen size={20} color={colors.white} />}
          onPress={handleBookLesson}
          loading={isLoading}
          style={styles.bookButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  environmentContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  environmentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  environmentBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  environmentText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  bookButton: {
    marginTop: 8,
  },
});

