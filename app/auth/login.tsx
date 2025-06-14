import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useUserStore } from "@/store/userStore";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { useThemeStore } from "@/store/themeStore";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useUserStore();
  const { isDarkMode } = useThemeStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/tabs");
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen
        options={{
          title: "Login",
          headerStyle: {
            backgroundColor: isDarkMode ? colors.backgroundDark : colors.background,
          },
          headerTintColor: isDarkMode ? colors.textDark : colors.text,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>Welcome Back</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkTextSecondary]}>
              Sign in to continue
            </Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <Mail size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <Lock size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
                ) : (
                  <Eye size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              onPress={handleLogin}
              title="Sign In"
              loading={isLoading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDarkMode && styles.darkTextSecondary]}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  darkContainer: {
    backgroundColor: colors.backgroundDark,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  darkText: {
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  darkTextSecondary: {
    color: colors.textSecondaryDark,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  darkInputContainer: {
    backgroundColor: colors.cardDark,
    borderColor: colors.borderDark,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  darkInput: {
    color: colors.textDark,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
});
