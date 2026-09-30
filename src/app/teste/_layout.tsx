import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TesteLayout() {
  return (
    <Stack screenLayout={({ children }) => <SafeAreaView style={{ flex: 1 }} edges={['top']}>{children}</SafeAreaView>}>
      <Stack.Screen name="index" options={{ title: "Lista", headerShown: false }} />
      <Stack.Screen name="detalhe" options={{ title: "Detalhe", presentation: "formSheet", sheetAllowedDetents: [0.8, 0.8] }} />
    </Stack>
  );
}
