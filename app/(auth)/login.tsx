import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebase";
import { Colors } from "../../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle user login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/_tabs");
    } catch (error: any) {
      Alert.alert("Login Error", "Invalid email or password");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.helloText, { color: Colors.dark.text }]}>
            Hello{" "}
          </Text>
          <Text style={[styles.subText, { color: "#BDBDBD" }]}>
            Sign in to start locking in
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {/* email Box */}
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: Colors.dark.surface },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#BDBDBD"
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#BDBDBD"
              style={[styles.input, { color: Colors.dark.text }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Box */}
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: Colors.dark.surface },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#BDBDBD"
              style={styles.icon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#BDBDBD"
              secureTextEntry
              style={[styles.input, { color: Colors.dark.text }]}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={styles.signInRow}>
          <Text style={[styles.signInText, { color: Colors.dark.text }]}>
            Sign in
          </Text>
          <TouchableOpacity
            style={[
              styles.arrowButton,
              { backgroundColor: Colors.dark.primary },
            ]}
            onPress={handleLogin}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={Colors.dark.background}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#BDBDBD" }}>
              Dont have an account? {""}
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text
                  style={[
                    styles.link,
                    { color: Colors.dark.primary, fontWeight: "bold" },
                  ]}
                >
                  Create
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
  header: { marginBottom: 50, alignItems: "center" },
  helloText: { fontSize: 80, fontWeight: "500", letterSpacing: -2 },
  subText: { fontSize: 16, marginTop: -5 },
  inputContainer: { gap: 20 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 40,
  },
  signInText: { fontSize: 24, fontWeight: "bold", marginRight: 15 },
  arrowButton: {
    width: 60,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: { alignItems: "center", marginTop: 80 },
  link: { fontWeight: "bold", textDecorationLine: "underline" },
});
