import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function TimerScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(1500); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  

  // Simple Timer Logic
  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <View style={styles.content}>
        <Text style={styles.label}>FOCUS SESSION</Text>
        
        {/* The Big Timer Circle */}
        <View style={[styles.timerCircle, { borderColor: Colors.dark.primary }]}>
          <Text style={[styles.timerText, { color: Colors.dark.text }]}>
            {formatTime(seconds)}
          </Text>
        </View>

        <TouchableOpacity 

>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>DEBUG: FORCE LOGOUT</Text>
</TouchableOpacity>

        {/* Controls */}
        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: Colors.dark.primary }]}
          onPress={() => setIsActive(!isActive)}
        >
          <Ionicons 
            name={isActive ? "pause" : "play"} 
            size={32} 
            color={Colors.dark.background} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => { setIsActive(false); setSeconds(1500); }}
          style={styles.resetButton}
        >
          <Text style={{ color: Colors.dark.textSecondary }}>Reset Timer</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
  style={{ 
    backgroundColor: 'rgba(255,0,0,0.5)', 
    padding: 10, 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 999,
    borderRadius: 5 
  }}
  onPress={async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/register");
    } catch (e) {
      console.log(e);
    }
  }}
>
  <Text style={{ color: 'white' }}>LOGOUT</Text>
</TouchableOpacity>
    </SafeAreaView>
  );
  
}



const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#BDBDBD', letterSpacing: 2, marginBottom: 20, fontWeight: '600' },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // Soft glow effect
    shadowColor: "#FF71CE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  timerText: { fontSize: 64, fontWeight: 'bold' },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: { marginTop: 30 },
});