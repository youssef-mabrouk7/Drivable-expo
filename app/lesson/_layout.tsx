import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Lessons' }} />
      <Stack.Screen name="[id]" options={{ title: 'Lesson Details' }} />
    </Stack>
  );
}