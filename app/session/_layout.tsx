import { Stack } from "expo-router";

export default function SessionLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{
          title: "Session Details",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}