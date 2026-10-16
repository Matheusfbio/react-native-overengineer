import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.Forms}>
          <Text style={[styles.title, { color: theme.text }]}>Meu Perfil</Text>
          <Text style={[styles.title, { color: theme.text }]}>Nome</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            value={name}
            onChangeText={setName}
          />
          <Text style={[styles.title, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={[styles.title, { color: theme.text }]}>Senha</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
          />
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.button}
            >
            <Text style={[styles.title, { color: theme.text }]}>Entrar</Text>
          </Pressable>
          <Link href="/signin"
            style={styles.button}
          >
            <Text style={[styles.title, { color: theme.text }]}>Criar uma nova conta</Text>
          </Link>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Dados preenchidos</Text>
                <Text style={styles.modalText}>Nome {name}</Text>
                <Text style={styles.modalText}>Email {email}</Text>
                <Text style={styles.modalText}>Senha {senha}</Text>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Fechar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "1%",
    justifyContent: "center",
    flexDirection: "column",
  },
  Forms: {
    flex: 1,
    marginTop: "20%",
    justifyContent: "center",
    flexDirection: "column",
  },
  safeAreaView: {
    flex: 1.1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
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
