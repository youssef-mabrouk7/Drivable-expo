import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Clock, MapPin } from "lucide-react-native";
import { Lesson } from "@/types";
import { colors } from "@/constants/colors";
import { drivingCenters, instructors } from "@/constants/mockData";

type LessonCardProps = {
  lesson: Lesson;
  showActions?: boolean;
};

export const LessonCard = ({ lesson, showActions = true }: LessonCardProps) => {
  const router = useRouter();
  const center = lesson.location;

  const formattedDate = new Date(lesson.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(lesson.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const handlePress = () => {
    router.push({
      pathname: "/lesson/[id]",
      params: { id: lesson.id },
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {center && (
        <Image
          source={{
            uri:
              "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          }}
          style={styles.centerImage}
          contentFit="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.locationRow}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.locationText}>
            {center ? center : "Location unavailable"}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.timeText}>
            {formattedDate}, {formattedTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
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
  centerImage: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontWeight: "500",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});

