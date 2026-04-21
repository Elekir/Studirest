import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { View, ActivityIndicator } from "react-native";
import { User } from "firebase/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    //  see if someone is "Signed In"
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#FF71CE" />
      </View>
    );
  }

  // If no user exists, send them to Login. If they do, send them to home.
  return user ? <Redirect href="/_tabs" /> : <Redirect href="/(auth)/register" />;
}