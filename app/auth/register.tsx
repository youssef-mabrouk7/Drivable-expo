import React, { useEffect, useState } from "react";
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
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react-native";
import { useUserStore } from "@/store/userStore";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { useThemeStore } from "@/store/themeStore";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useUserStore();
  const { isDarkMode } = useThemeStore();
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        age: "30", // Default age
        handicapType: 0,
        transmissionType: 0, // Default to automatic
      });
      router.replace("/tabs");
    } catch (error) {
      return;
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen
        options={{
          title: "Register",
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
            <Text style={[styles.title, isDarkMode && styles.darkText]}>Create Account</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkTextSecondary]}>
              Sign up to get started
            </Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <User size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="First Name"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <User size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Last Name"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <Mail size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <Phone size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Phone Number"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <Lock size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
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

            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
              <Lock size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Confirm Password"
                placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
                ) : (
                  <Eye size={20} color={isDarkMode ? colors.textSecondaryDark : colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            {(error || formError) && (
              <Text style={styles.errorText}>{error || formError}</Text>
            )}

            <Button
              onPress={handleRegister}
              title="Sign Up"
              loading={isLoading}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDarkMode && styles.darkTextSecondary]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.footerLink}>Sign In</Text>
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

