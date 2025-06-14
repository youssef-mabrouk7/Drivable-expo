import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
} from "lucide-react-native";
import { useUserStore } from "@/store/userStore";
import { colors } from "@/constants/colors";
import { useThemeStore } from "@/store/themeStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout();
      router.replace("/");
    } else {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Log Out",
            onPress: () => {
              logout();
              router.replace("/auth/login");
            },
            style: "destructive",
          },
        ],
      );
    }
  };

  const menuItems = [
    {
      title: "Account",
      items: [
        {
          icon: <User size={20} color={colors.primary} />,
          label: "Personal Information",
          onPress: () => router.push("/profile/personal-info"),
        },
        {
          icon: <Settings size={20} color={colors.primary} />,
          label: "Preferences",
          onPress: () => router.push("/profile/preferences"),
        },
        {
          icon: <CreditCard size={20} color={colors.primary} />,
          label: "Payment Methods",
          onPress: () => router.push("/profile/payment"),
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          icon: isDarkMode ? <Sun size={20} color={colors.primary} /> : <Moon size={20} color={colors.primary} />,
          label: isDarkMode ? "Light Mode" : "Dark Mode",
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          icon: <Bell size={20} color={colors.primary} />,
          label: "Notifications",
          onPress: () => router.push("/profile/notifications"),
        },
        {
          icon: <HelpCircle size={20} color={colors.primary} />,
          label: "Help & Support",
          onPress: () => router.push("/profile/help"),
        },
        {
          icon: <LogOut size={20} color={colors.error} />,
          label: "Log Out",
          onPress: handleLogout,
          textColor: colors.error,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Text style={[styles.profileName, isDarkMode && styles.darkText]}>{user?.firstName || "User"}</Text>
          <Text style={[styles.profileEmail, isDarkMode && styles.darkTextSecondary]}>
            {user?.email || "user@example.com"}
          </Text>
          <Text style={[styles.profilePhone, isDarkMode && styles.darkTextSecondary]}>
            {user?.phone || "No phone number"}
          </Text>

          <TouchableOpacity
            style={[styles.editProfileButton, isDarkMode && styles.darkEditButton]}
            onPress={() => router.push("/profile/edit")}
          >
            <Text style={[styles.editProfileText, isDarkMode && styles.darkEditText]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={[styles.menuSectionTitle, isDarkMode && styles.darkText]}>{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[styles.menuItem, isDarkMode && styles.darkMenuItem]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  {item.icon}
                  <Text
                    style={[
                      styles.menuItemLabel,
                      isDarkMode && styles.darkText,
                      item.textColor ? { color: item.textColor } : null,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={20} color={isDarkMode ? colors.textSecondaryDark : colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, isDarkMode && styles.darkTextSecondary]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 32,
  },
  darkContainer: {
    backgroundColor: colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  darkText: {
    color: colors.textDark,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  darkTextSecondary: {
    color: colors.textSecondaryDark,
  },
  profilePhone: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  darkEditButton: {
    backgroundColor: colors.primaryDark,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  darkEditText: {
    color: colors.primaryLight,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  darkMenuItem: {
    borderBottomColor: colors.borderDark,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

