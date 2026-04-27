import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from "expo-image";
import { useRouter } from 'expo-router'; 
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../../config/firebase"; 
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser; // Get the current logged-in user

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Sign Out", 
        style: "destructive", 
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Error", "Could not sign out.");
          }
        } 
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* PROFILE SECTION */}
        <View style={[styles.ProfileSection, { borderBottomColor: Colors.dark.border }]}>
          <TouchableOpacity style={styles.imageWrapper}>
            <View style={[styles.profileImage, styles.profileImagePlaceholder, { backgroundColor: Colors.dark.surface }]}>
              <Text style={[styles.ProfileImageText, { color: Colors.dark.primary }]}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={[styles.editBadge, { backgroundColor: Colors.dark.primary }]}>
              <Ionicons name="camera" size={12} color="white" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.name, { color: Colors.dark.text }]}>
            {user?.displayName || "Student"}
          </Text>
          <Text style={[styles.email, { color: Colors.dark.textSecondary }]}>
            {user?.email}
          </Text>
        </View>

        {/* ACCOUNT SETTINGS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.dark.primary }]}>Account</Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: Colors.dark.surface }]}>
            <Text style={[styles.settingLabel, { color: Colors.dark.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: Colors.dark.surface }]}>
            <Text style={[styles.settingLabel, { color: Colors.dark.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* APP SETTINGS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.dark.primary }]}>Preferences</Text>

          <View style={[styles.settingItem, { backgroundColor: Colors.dark.surface }]}>
            <Text style={[styles.settingLabel, { color: Colors.dark.text }]}>Dark Mode</Text>
            <Ionicons name="moon" size={18} color={Colors.dark.primary} />
          </View>
        </View>

        {/* SIGN OUT & DELETE ACCOUNT */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: Colors.dark.surface, marginTop: 20 }]} 
            onPress={handleSignOut}
          >
            <Text style={[styles.settingLabel, { color: '#FF4B4B', fontWeight: 'bold' }]}>Sign Out</Text>
            <Ionicons name="log-out-outline" size={18} color="#FF4B4B" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FF4B4B', marginTop: 10 }]}>
            <Text style={[styles.settingLabel, { color: '#FF4B4B' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100, 
  },
  ProfileSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: 'rgba(255, 113, 206, 0.3)',
  },
  ProfileImageText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1F1137', 
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
});