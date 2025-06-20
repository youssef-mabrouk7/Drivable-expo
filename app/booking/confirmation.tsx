import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { CheckCircle, Calendar, Home } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';

export default function ConfirmationScreen() {
  const router = useRouter();
  
  const handleViewSchedule = () => {
    router.replace('/tabs/sessions'); // Changed from '/tabs/schedule' to existing route
  };
  
  const handleGoHome = () => {
    router.replace('/tabs');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Booking Confirmation',
          headerBackVisible: false,
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={colors.success} />
        </View>
        
        <Text style={styles.title}>Booking Confirmed!</Text>
        
        <Text style={styles.message}>
          Your driving lesson has been successfully booked. You will receive a confirmation email shortly.
        </Text>
        
        <View style={styles.actionsContainer}>
          <Button
            title="View Schedule"
            variant="outline"
            icon={<Calendar size={20} color={colors.primary} />}
            onPress={handleViewSchedule}
            style={styles.button}
          />
          
          <Button
            title="Go to Home"
            variant="primary"
            icon={<Home size={20} color="white" />}
            onPress={handleGoHome}
            style={styles.button}
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});