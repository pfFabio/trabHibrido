import { Stack } from "expo-router";
import { Platform } from "react-native";
import * as SystemUI from "expo-system-ui";

// Garante que a Activity e Window nativa do Android usem fundo escuro #131314 em vez de branco
if (Platform.OS !== 'web') {
  SystemUI.setBackgroundColorAsync('#131314');
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#131314', flex: 1 },
        animation: 'slide_from_right',
        animationDuration: 300,
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
      <Stack.Screen
        name="livro-detalhes"
        options={{
          animation: 'slide_from_right',
          animationDuration: 420,
        }}
      />
      <Stack.Screen
        name="booking-detalhes"
        options={{
          animation: 'slide_from_right',
          animationDuration: 420,
        }}
      />
    </Stack>
  );
}
