import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#131314', flex: 1 },
        animation: 'slide_from_right',
        animationDuration: 420,
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="livros" options={{ animation: 'none' }} />
      <Stack.Screen
        name="perfil"
        options={{
          animation: 'slide_from_right',
          animationDuration: 420,
        }}
      />
      <Stack.Screen
        name="gerenciar"
        options={{
          animation: 'slide_from_right',
          animationDuration: 420,
        }}
      />
    </Stack>
  );
}
