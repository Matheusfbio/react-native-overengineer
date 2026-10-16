import { useCallback, useEffect, useState } from "react";
import { API_HOST } from "@/constants/api";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ok"; products: Product[] };

export function useProducts() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setState({ status: "loading" });

    fetch(`${API_HOST}/api/payments/products`)
      .then((r) => r.json())
      .then((json: { products?: Product[]; error?: string }) => {
        if (!json.products) throw new Error(json.error ?? "Erro ao carregar produtos.");
        setState({ status: "ok", products: json.products });
      })
      .catch((err: unknown) => {
        setState({ status: "error", message: err instanceof Error ? err.message : "Erro inesperado." });
      })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  return { state, refreshing, refresh };
}
