import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  MapPin,
  User,
} from "lucide-react-native";
import { useLessonStore } from "@/store/LessonStore";
import { DatePicker } from "@/components/DatePicker";
import { InstructorCard } from "@/components/InstructorCard";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import {
  drivingCenters,
  instructors,
  lessonTopics,
  timeSlots,
} from "@/constants/mockData";
import { BookingFormData } from "@/types";

export default function BookingScreen() {
  const router = useRouter();
  const { bookLesson, isLoading } = useLessonStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingFormData>({});

  const handleDateChange = (date: Date) => {
    setBookingData((prev) => ({ ...prev, date }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingData((prev) => ({ ...prev, time }));
  };

  const handleDurationSelect = (duration: number) => {
    setBookingData((prev) => ({ ...prev, duration }));
  };

  const handleInstructorSelect = (instructorId: string) => {
    setBookingData((prev) => ({ ...prev, instructorId }));
  };

  const handleTopicSelect = (topic: string) => {
    setBookingData((prev) => ({ ...prev, topic }));
  };

  const handleNotesChange = (notes: string) => {
    setBookingData((prev) => ({ ...prev, notes }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleBookLesson();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleBookLesson = async () => {
    try {
      await bookLesson(bookingData);
      router.replace("/app/booking/confirmation");
    } catch (error) {
      console.error("Failed to book lesson:", error);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.stepDot,
              currentStep === step && styles.activeStepDot,
              currentStep > step && styles.completedStepDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <View style={styles.stepHeader}>
              <Calendar size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>Select Date & Time</Text>
            </View>

            <DatePicker
              selectedDate={bookingData.date}
              onDateChange={handleDateChange}
              minDate={new Date()}
            />

            <Text style={styles.sectionTitle}>Select Time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotContainer}
            >
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    bookingData.time === time && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      bookingData.time === time && styles.selectedTimeSlotText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Lesson Duration</Text>
            <View style={styles.durationContainer}>
              <TouchableOpacity
                style={[
                  styles.durationOption,
                  bookingData.duration === 60 && styles.selectedDurationOption,
                ]}
                onPress={() => handleDurationSelect(60)}
              >
                <Text
                  style={[
                    styles.durationText,
                    bookingData.duration === 60 && styles.selectedDurationText,
                  ]}
                >
                  60 min
                </Text>
                <Text
                  style={[
                    styles.durationPrice,
                    bookingData.duration === 60 && styles.selectedDurationPrice,
                  ]}
                >
                  $45
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.durationOption,
                  bookingData.duration === 90 && styles.selectedDurationOption,
                ]}
                onPress={() => handleDurationSelect(90)}
              >
                <Text
                  style={[
                    styles.durationText,
                    bookingData.duration === 90 && styles.selectedDurationText,
                  ]}
                >
                  90 min
                </Text>
                <Text
                  style={[
                    styles.durationPrice,
                    bookingData.duration === 90 && styles.selectedDurationPrice,
                  ]}
                >
                  $65
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <View style={styles.stepHeader}>
              <User size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>Select Instructor</Text>
            </View>

            <Text style={styles.instructionText}>
              Choose an instructor for your lesson. All our instructors are
              certified and experienced.
            </Text>
          </>
        );

      case 3:
        return (
          <>
            <View style={styles.stepHeader}>
              <FileText size={24} color={colors.primary} />
              <Text style={styles.stepTitle}>Lesson Details</Text>
            </View>

            <Text style={styles.sectionTitle}>Select Topic</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topicContainer}
            >
              {lessonTopics.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.topicOption,
                    bookingData.topic === topic && styles.selectedTopicOption,
                  ]}
                  onPress={() => handleTopicSelect(topic)}
                >
                  <Text
                    style={[
                      styles.topicText,
                      bookingData.topic === topic && styles.selectedTopicText,
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Driving Center</Text>
            <View style={styles.centerCard}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.centerInfo}>
                <Text style={styles.centerName}>
                </Text>
                <Text style={styles.centerAddress}>
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>
                  {bookingData.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time:</Text>
                <Text style={styles.summaryValue}>{bookingData.time}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>
                  {bookingData.duration} minutes
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Instructor:</Text>
                <Text style={styles.summaryValue}>
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Topic:</Text>
                <Text style={styles.summaryValue}>{bookingData.topic}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price:</Text>
                <Text style={[styles.summaryValue, styles.priceValue]}>
                  ${bookingData.duration === 60 ? 45 : 65}
                </Text>
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Book a Lesson",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back"
          variant="outline"
          onPress={handlePreviousStep}
          style={{ flex: 1, marginRight: 8 }}
        />

        <Button
          title={currentStep === 3 ? "Confirm Booking" : "Next"}
          variant="primary"
          loading={isLoading}
          onPress={handleNextStep}
          icon={currentStep < 3
            ? <ArrowRight size={20} color="white" />
            : undefined}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
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
    paddingBottom: 100, // Extra padding for footer
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: colors.primary,
    width: 20,
  },
  completedStepDot: {
    backgroundColor: colors.primary,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  timeSlotContainer: {
    paddingBottom: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTimeSlotText: {
    color: "white",
    fontWeight: "500",
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDurationOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durationText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  selectedDurationText: {
    color: "white",
  },
  durationPrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedDurationPrice: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  instructionText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  topicContainer: {
    paddingBottom: 8,
  },
  topicOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTopicOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  topicText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTopicText: {
    color: "white",
    fontWeight: "500",
  },
  centerCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  centerInfo: {
    marginLeft: 12,
  },
  centerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  priceValue: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
});
