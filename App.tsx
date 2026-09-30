import { Asset } from "expo-asset";
import { File, Paths } from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";

const ADVANCE_MS = 5 * 60 * 1000;
const DELIVERED_LINGER_MS = 3 * 1000;
const ETA_MS = ADVANCE_MS * 2;

const STAGES = ["Preparing", "On the way", "Delivered"] as const;

type DeliveryProps = {
  orderId: string;
  status: string;
  stage: number;
  startEpochMs: number;
  etaEpochMs: number;
  logoUri?: string;
};

// Stub — replace with the real native module import when available.
const CounterWidget = {
  updateSnapshot: (_props: {
    count: number;
    logoUri?: string;
    gridUri?: string;
  }) => {},
};

// Stub — replace with the real native module import when available.
const DeliveryActivity = {
  start: (_props: DeliveryProps) => ({
    update: (_props: DeliveryProps) => {},
    end: (_policy: string) => {},
  }),
};

async function ensureImageInSharedStorage(
  fileName: string,
  assetModule: number,
): Promise<string> {
  const file = new File(
    Paths.appleSharedContainers?.["group.your.app.id"] ?? Paths.document,
    fileName,
  );
  if (!file.exists) {
    const asset = await Asset.fromModule(assetModule).downloadAsync();
    await new File(asset.localUri!).copy(file);
  }
  return file.uri;
}

export default function App() {
  const [count, setCount] = useState(0);
  const [imageUris, setImageUris] = useState<{
    logoUri: string;
    gridUri: string;
  }>();
  const [deliveryRunning, setDeliveryRunning] = useState(false);
  const activityRef = useRef<ReturnType<typeof DeliveryActivity.start> | null>(
    null,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    Promise.all([
      ensureImageInSharedStorage(
        "logo.png",
        require("./assets/images/logo.png"),
      ),
      ensureImageInSharedStorage(
        "background-grid.png",
        require("./assets/images/background-grid.png"),
      ),
    ]).then(([logoUri, gridUri]) => {
      setImageUris({ logoUri, gridUri });
      CounterWidget.updateSnapshot({ count: 0, logoUri, gridUri });
    });
  }, []);

  const increment = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    if (imageUris) {
      CounterWidget.updateSnapshot({ count: nextCount, ...imageUris });
    }
  };

  const propsForStage = (
    stage: number,
    startEpochMs: number,
    etaEpochMs: number,
  ): DeliveryProps => ({
    orderId: "1234",
    status: STAGES[stage],
    stage,
    startEpochMs,
    etaEpochMs,
    logoUri: imageUris?.logoUri,
  });

  const startDelivery = () => {
    if (!imageUris || deliveryRunning) return;
    try {
      const startEpochMs = Date.now();
      const etaEpochMs = startEpochMs + ETA_MS;
      activityRef.current = DeliveryActivity.start(
        propsForStage(0, startEpochMs, etaEpochMs),
      );
      setDeliveryRunning(true);
      let stage = 0;
      intervalRef.current = setInterval(() => {
        stage += 1;
        activityRef.current?.update(
          propsForStage(stage, startEpochMs, etaEpochMs),
        );
        if (stage >= STAGES.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDeliveryRunning(false);
          setTimeout(() => {
            activityRef.current?.end("default");
            activityRef.current = null;
          }, DELIVERED_LINGER_MS);
        }
      }, ADVANCE_MS);
    } catch (e) {
      console.warn("Could not start Live Activity", e);
    }
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      activityRef.current?.end("immediate");
    },
    [],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Widgets Example</Text>
      <Text style={styles.count}>Count: {count}</Text>
      <Button title="Increment and update widget" onPress={increment} />
      <Text style={styles.hint}>
        Add "Counter Widget" to your home screen, then tap the button to update
        it.
      </Text>
      <Button
        title={
          deliveryRunning
            ? "Delivery in progress…"
            : "Start delivery Live Activity"
        }
        onPress={startDelivery}
        disabled={deliveryRunning || !imageUris}
      />
      <Text style={styles.hint}>
        Starts a Live Activity that auto-advances through delivery stages on the
        Lock Screen and Dynamic Island, then dismisses itself.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  count: { fontSize: 32, fontWeight: "bold" },
  hint: { textAlign: "center", color: "#666" },
});
