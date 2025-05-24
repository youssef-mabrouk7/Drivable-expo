import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';

export default function CancellationConfirmationScreen() {
  const router = useRouter();

  const handleGoToSchedule = () => {
    router.replace('/tabs/schedule');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Cancellation Confirmed' }} />
      
      <View style={styles.content}>
        <CheckCircle size={64} color={colors.success} />
        <Text style={styles.title}>Lesson Cancelled</Text>
        <Text style={styles.message}>
          Your lesson has been successfully cancelled.
        </Text>
        {/* Optionally display details about the cancelled lesson here */}

        <Button
          title="Go to Schedule"
          variant="primary"
          onPress={handleGoToSchedule}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
    width: '80%',
    maxWidth: 300,
  },
}); 