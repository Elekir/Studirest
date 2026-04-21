import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Sign Up/Registration Logic with alert 
  const handleRegister = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Alert.alert("Success", "Account created!"); // Optional
      router.replace("/_tabs"); 
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'android' ? 'height' : 'padding'} 
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.titleText, { color: Colors.dark.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subText, { color: "#BDBDBD" }]}>
              Sign up to start locking in
            </Text>
          </View>

          <View style={styles.inputContainer}>
            {/* First Name Box */}
            <View style={[styles.inputWrapper, { backgroundColor: Colors.dark.surface }]}>
              <Ionicons name="person-outline" size={20} color="#BDBDBD" style={styles.icon} />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#BDBDBD"
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.input, { color: Colors.dark.text }]}
              />
            </View>

            {/* Email Box */}
            <View style={[styles.inputWrapper, { backgroundColor: Colors.dark.surface }]}>
              <Ionicons name="mail-outline" size={20} color="#BDBDBD" style={styles.icon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#BDBDBD"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { color: Colors.dark.text }]}
              />
            </View>

            {/* Password Box */}
            <View style={[styles.inputWrapper, { backgroundColor: Colors.dark.surface }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#BDBDBD" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { color: Colors.dark.text }]}
              />
            </View>
          </View>

          
          <View style={styles.actionRow}>
            <Text style={[styles.actionText, { color: Colors.dark.text }]}>
              Sign up
            </Text>
            <TouchableOpacity
              style={[styles.arrowButton, { backgroundColor: Colors.dark.primary }]}
              onPress={handleRegister}
            >
              <Ionicons name="arrow-forward" size={24} color={Colors.dark.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={{ color: "#BDBDBD" }}>
                Already have an account?{" "}
                <Text style={[styles.link, { color: Colors.dark.primary }]}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
  header: { marginBottom: 40, alignItems: "center" },
  titleText: { fontSize: 40, fontWeight: "500", letterSpacing: -1 },
  subText: { fontSize: 16, marginTop: 5 },
  inputContainer: { gap: 15 },
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
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 40,
  },
  actionText: { fontSize: 24, fontWeight: "bold", marginRight: 15 },
  arrowButton: {
    width: 60,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: { alignItems: "center", marginTop: 50 },
  link: { fontWeight: "bold", textDecorationLine: "underline" },
});