import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleCreateAccount = () => {
    setError("");
    if (!name.trim() || !email.trim() || !senha.trim()) {
      const message = "Por favor, preencha todos os campos."
      setError(message);

      return;
    }

    if (senha.length < 6) {
      const message = "A senha deve ter pelo menos 6 caracteres."
      setError(message)
      return;
    }

    // Se todas as validações passarem
    setLoading(false)
  };
  return (
    
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.form}>
          <Text style={[styles.titleH1, { color: theme.text }]}>Criando uma conta</Text>
          <Text style={[styles.title, { color: theme.text }]}>Nome</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            value={name}
            placeholder="Nome do usuário"
            onChangeText={setName}
          />
          <Text style={[styles.title, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu email"
            onChangeText={setEmail}
          />
          <Text style={[styles.title, { color: theme.text }]}>Senha</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
          />
          {error !== "" && (
            <Text style={styles.error}>
                 {error}
            </Text>
          )}
           <TouchableOpacity
            onPress={handleCreateAccount}
            style={styles.button}
            >
            <Text style={[styles.title, { color: theme.text }]}>Criar um conta</Text>
          </TouchableOpacity>
        </View>
        
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: {
  color: "red",
  textAlign: "center",
  marginTop: 10,
},
  container: {
    flex: 1,
    marginTop: "1%",
    justifyContent: "center",
    flexDirection: "column",
  },
form: {
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 20,
  gap: 8,
},
  safeAreaView: {
    flex: 1.1,
  },
  input: {
    height: 40,
    marginHorizontal:12,
    borderColor: "gray",
    borderWidth: 2,
    color: "white",
    textAlign: "center"
  },
  button: {
    padding: 12,
    marginTop: 20,
    backgroundColor: "green",
  },
  modalButtonText: {
    color: "white",
  },
  title: {
    textAlign: "center",
    color: "white",
    margin: Spacing.one,
  },
  titleH1: {
    fontSize: 23,
    textAlign: "center",
    color: "white",
    margin: Spacing.one,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

});
