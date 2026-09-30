import { StyleSheet } from "react-native";

import { CustonButton } from "@/components/CustonButton";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ThemedView style={{flex:1, marginTop: "70%"}}>
        <CustonButton title="cupom" onPress={() => console.log("Cupom PIX2k ativado")}>PIX2k</CustonButton>
          <CustonButton title="cupom" onPress={() => console.log("Cupom PIX5k ativado")
        }>PIX5k</CustonButton>
        <CustonButton title="cupom" onPress={() => console.log("Cupom PIX3k ativado")
        }>PIX3k</CustonButton>

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: "center",
    gap: Spacing.one,
    alignItems: "center",
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: "center",
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
