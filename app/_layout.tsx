import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "splash",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
          },
          headerTintColor: isDarkMode ? colors.textDark : colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
          },
        }}
      >
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="lesson" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

