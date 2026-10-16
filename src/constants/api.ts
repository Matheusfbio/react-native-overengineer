import { Platform } from "react-native";

// Android emulator  → 10.0.2.2  (loopback do host)
// Android físico    → IP da máquina na LAN
// iOS / web         → localhost
const ANDROID_HOST = "https://cae9-201-182-58-249.ngrok-free.app";

export const API_HOST = Platform.select({
  android: ANDROID_HOST,
  default: "http://localhost:3333",
});
