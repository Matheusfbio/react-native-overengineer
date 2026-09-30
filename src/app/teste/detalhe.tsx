import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetalheScreen() {
  const { name, drug } = useLocalSearchParams<{ name: string; drug: string }>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "darkblue" }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>{name}</Text>
        <Text style={{ color: "white", fontSize: 16, marginTop: 12 }}>{drug}</Text>
      </ThemedView>
    </SafeAreaView>
  );
}
