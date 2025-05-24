import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Navigator, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

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

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, checkAuthStatus } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const isAuth = await checkAuthStatus();

      const inAuthGroup = segments[0] === "auth";

      if (!isAuth && !inAuthGroup) {
        // Redirect to the login page if not authenticated
        router.replace("/tabs");
      } else if (isAuth && inAuthGroup) {
        // Redirect to the home page if authenticated and on an auth page
        router.replace("/auth/login");
      }
    };

    // checkAuth();
  }, [isAuthenticated, segments]);

  return (
    <Stack>
      <Stack.Screen
        name="tabs"
        options={{ headerShown: true, title: "home" }}
      />
      <Stack.Screen
        name="booking/confirmation"
        options={{ headerShown: true }}
      />
      <Stack.Screen name="booking/new" options={{ headerShown: true }} />
      <Stack.Screen name="lesson/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/index" options={{ headerShown: false }} />
    </Stack>
  );
}
