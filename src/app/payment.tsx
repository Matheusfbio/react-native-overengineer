import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustonButton } from "@/components/CustonButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCheckout } from "@/hooks/use-checkout";
import { type Product, useProducts } from "@/hooks/use-products";
import { useTheme } from "@/hooks/use-theme";

function ProductCard({
  product,
  onBuy,
  disabled,
}: {
  product: Product;
  onBuy: () => void;
  disabled: boolean;
}) {
  const theme = useTheme();
  const price = (product.price / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.cardEmoji}>
        <ThemedText type="title">🛍️</ThemedText>
      </View>
      <View style={styles.cardBody}>
        <ThemedText type="smallBold">{product.name}</ThemedText>
        {product.description ? (
          <ThemedText type="small" themeColor="textSecondary">
            {product.description}
          </ThemedText>
        ) : null}
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          {price}
        </ThemedText>
      </View>
      <CustonButton title="Comprar" onPress={onBuy} disabled={disabled} />
    </ThemedView>
  );
}

export default function PaymentScreen() {
  const { status: checkoutStatus, errorMessage, startCheckout } = useCheckout();
  const { state, refreshing, refresh } = useProducts();
  const isCheckingOut = checkoutStatus === "loading";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.header}>
          🏪 Loja
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
          Puxe para baixo para atualizar
        </ThemedText>

        {state.status === "loading" ? (
          <ActivityIndicator size="large" style={styles.spinner} />
        ) : state.status === "error" ? (
          <View style={styles.errorBox}>
            <ThemedText type="small" style={styles.error}>
              {state.message}
            </ThemedText>
            <CustonButton title="Tentar novamente" onPress={refresh} />
          </View>
        ) : (
          <FlatList
            data={state.products}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                disabled={isCheckingOut}
                onBuy={() => startCheckout(item.id)}
              />
            )}
            ListEmptyComponent={
              <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
                Nenhum produto disponível no momento.
              </ThemedText>
            }
          />
        )}

        {isCheckingOut && (
          <View style={styles.checkoutOverlay}>
            <ActivityIndicator size="large" />
            <ThemedText type="small" themeColor="textSecondary">
              Abrindo checkout…
            </ThemedText>
          </View>
        )}

        {checkoutStatus === "error" && errorMessage && (
          <ThemedText type="small" style={styles.error}>
            {errorMessage}
          </ThemedText>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  header: { marginBottom: 2 },
  sub: { marginBottom: 12 },
  list: { gap: 12, paddingBottom: 24 },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardEmoji: { width: 48, alignItems: "center" },
  cardBody: { flex: 1, gap: 2 },
  spinner: { marginTop: 40 },
  errorBox: { alignItems: "center", gap: 12, marginTop: 40 },
  error: { textAlign: "center", color: "#e53e3e" },
  empty: { textAlign: "center", marginTop: 40 },
  checkoutOverlay: { alignItems: "center", gap: 8, paddingVertical: 12 },
});
