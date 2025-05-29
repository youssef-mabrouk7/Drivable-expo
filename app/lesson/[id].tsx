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
import { Image } from "expo-image";
import {
  Calendar,
  ChevronLeft,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  X,
} from "lucide-react-native";
import { useLessonStore } from "@/store/LessonStore";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { drivingCenters, instructors } from "@/constants/mockData";
import { DrivingCenter, Instructor, Lesson } from "@/types";

export default function LessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { upcomingLessons, pastLessons, cancelLesson, isLoading } =
    useLessonStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [center, setCenter] = useState<DrivingCenter | null>(null);

  useEffect(() => {
    // Find the lesson in either upcoming or past lessons
    const foundLesson = [...upcomingLessons, ...pastLessons].find(
      (lesson) => lesson.id === id,
    );

    if (foundLesson) {
      setLesson(foundLesson);

      // Find the instructor if instructorId exists
      if (foundLesson.instructorId) {
        const foundInstructor = instructors.find(
          (instructor) => instructor.id === foundLesson.instructorId,
        );
        setInstructor(foundInstructor || null);
      }

      // Find the center if centerId exists
      if (foundLesson.centerId) {
        const foundCenter = drivingCenters.find(
          (center) => center.id === foundLesson.centerId,
        );
        setCenter(foundCenter || null);
      }
    }
  }, [id, upcomingLessons, pastLessons]);

  const handleCancelLesson = () => {
    if (!lesson) return;

    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to cancel this lesson?")) {
        cancelLesson(lesson.id);
        router.replace("/tabs/schedule");
      }
    } else {
      Alert.alert(
        "Cancel Lesson",
        "Are you sure you want to cancel this lesson? This action cannot be undone.",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes, Cancel",
            onPress: async () => {
              await cancelLesson(lesson.id);
              router.replace("/tabs/schedule");
            },
            style: "destructive",
          },
        ],
      );
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

  const isPastLesson = lesson.status === "completed" ||
    lesson.status === "cancelled";

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
            <Text style={styles.title}>{lesson.topic}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(lesson.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(lesson.status) },
                ]}
              >
                {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              {formattedTime} • {lesson.duration} minutes
            </Text>
          </View>

          {center && (
            <View style={styles.infoRow}>
              <MapPin size={20} color={colors.primary} />
              <View>
                <Text style={styles.infoText}>{center.name}</Text>
                <Text style={styles.subInfoText}>{center.address}</Text>
              </View>
            </View>
          )}

          {lesson.notes && (
            <View style={styles.infoRow}>
              <FileText size={20} color={colors.primary} />
              <Text style={styles.infoText}>{lesson.notes}</Text>
            </View>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${lesson.price}</Text>
          </View>
        </View>

        {instructor && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Instructor</Text>

            <View style={styles.instructorContainer}>
              <Image
                source={{ uri: instructor.avatar }}
                style={styles.instructorImage}
                contentFit="cover"
              />

              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>{instructor.name}</Text>

                <View style={styles.ratingContainer}>
                  <Star
                    size={16}
                    color={colors.secondary}
                    fill={colors.secondary}
                  />
                  <Text style={styles.rating}>{instructor.rating}</Text>
                  <Text style={styles.reviews}>
                    ({instructor.reviews} reviews)
                  </Text>
                </View>

                <Text style={styles.experience}>
                  {instructor.experience} experience
                </Text>
              </View>
            </View>

            <Text style={styles.bio}>{instructor.bio}</Text>

            <View style={styles.contactContainer}>
              <Button
                title="Call"
                variant="outline"
                icon={<Phone size={16} color={colors.primary} />}
                style={styles.contactButton}
              />

              <Button
                title="Email"
                variant="outline"
                icon={<Mail size={16} color={colors.primary} />}
                style={styles.contactButton}
              />

              <Button
                title="Message"
                variant="outline"
                icon={<MessageCircle size={16} color={colors.primary} />}
                style={styles.contactButton}
              />
            </View>
          </View>
        )}

        {!isPastLesson && (
          <Button
            title="Cancel Lesson"
            variant="outline"
            icon={<X size={20} color={colors.error} />}
            onPress={handleCancelLesson}
            loading={isLoading}
            style={styles.cancelButton}
            textStyle={{ color: colors.error }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: Lesson["status"]) => {
  switch (status) {
    case "confirmed":
      return colors.primary;
    case "pending":
      return colors.secondary;
    case "completed":
      return colors.success;
    case "cancelled":
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
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
  subInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  instructorContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  instructorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  experience: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    marginTop: 8,
    borderColor: colors.error,
  },
});

