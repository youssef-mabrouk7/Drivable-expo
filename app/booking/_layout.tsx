import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="new" options={{ title: 'Book a Lesson' }} />
      <Stack.Screen name="confirmation" options={{ title: 'Booking Confirmed' }} />
      <Stack.Screen name="cancellation-confirmation" options={{ title: 'Cancellation Confirmed' }} />
    </Stack>
  );
}