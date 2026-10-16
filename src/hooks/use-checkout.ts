import { openBrowserAsync, WebBrowserResultType } from "expo-web-browser";
import { router } from "expo-router";
import { useState } from "react";
import { API_HOST } from "@/constants/api";

type Status = "idle" | "loading" | "error";

export function useCheckout() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function startCheckout(productId?: string) {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_HOST}/api/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: productId ? JSON.stringify({ productId }) : undefined,
      });

      const json = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !json.url) {
        throw new Error(json.error ?? "Não foi possível iniciar o pagamento.");
      }

      const result = await openBrowserAsync(json.url);

      if (result.type === WebBrowserResultType.CANCEL || result.type === WebBrowserResultType.DISMISS) {
        router.replace("/payment");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro inesperado.");
      setStatus("error");
      return;
    }

    setStatus("idle");
  }

  return { status, errorMessage, startCheckout };
}
