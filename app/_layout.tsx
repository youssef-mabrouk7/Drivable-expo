import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useUserStore } from "@/store/userStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const unstable_settings = {
  initialRouteName: "intro",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading } = useUserStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Clear persisted state on app start
  useEffect(() => {
    const clearPersistedState = async () => {
      try {
        await AsyncStorage.removeItem('user-storage');
      } catch (error) {
        console.error('Error clearing persisted state:', error);
      }
    };
    clearPersistedState();
  }, []);

  useEffect(() => {
    if (!loaded || isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inSplashGroup = segments[0] === 'splash';
    const inIntroGroup = segments[0] === 'intro';

    // Only navigate if we're not already on the correct screen
    if (!user && !inAuthGroup && !inSplashGroup && !inIntroGroup) {
      // Redirect to the sign-in page if not signed in
      router.replace('intro' as any);
    } else if (user && (inAuthGroup || inIntroGroup)) {
      // Redirect to the home page if signed in
      router.replace('tabs' as any);
    }
  }, [user, segments, isLoading, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="intro" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: true }} />
        <Stack.Screen name="lesson" options={{ headerShown: true }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: true }} />
      </Stack>
    </ErrorBoundary>
  );
}