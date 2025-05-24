import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function LessonIndex() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Lessons',
          headerShown: true,
        }} 
      />
      <Text style={styles.text}>Lessons Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
}); 