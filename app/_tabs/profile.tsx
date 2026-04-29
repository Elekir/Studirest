import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Switch } from 'react-native';
import { deleteUser } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../../config/firebase"; 
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser; // Get the current logged-in user
  const displayName = user?.email?.split("@")[0] || "Student";
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { isDayMode, toggleTheme, theme } = useTheme();


 // Image Picker Function
  const pickImage = async () => {
    // Request permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to change your profile picture.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true, // Let them crop it to a square
      aspect: [1, 1],
      quality: 0.7, 
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

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

  // Account delete
  const handleDeleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) return;

  // confirmation first!
  Alert.alert(
    "Delete Account",
    "Are you sure? This will permanently delete all your study data and modules. This cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete Everything", 
        style: "destructive", 
        onPress: async () => {
          try {
            // Clean up user's Firestore data (Modules)
            const q = query(collection(db, "modules"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            
            // Delete each module document
            const deletePromises = querySnapshot.docs.map(document => 
              deleteDoc(doc(db, "modules", document.id))
            );
            await Promise.all(deletePromises);

            // Delete the actual User Auth account
            await deleteUser(user);
            
            // Send them back to onboarding/login
            router.replace('/onboarding');
          } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
              Alert.alert("Security Check", "Please log out and log back in before deleting your account.");
            } else {
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          }
        }
      }
    ]
  );
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* PROFILE SECTION */}
        <View style={[styles.ProfileSection, { borderBottomColor: theme.border }]}>
          <TouchableOpacity style={styles.imageWrapper} onPress={pickImage} activeOpacity={0.8}>
            <View style={[styles.profileImage, styles.profileImagePlaceholder, { backgroundColor: theme.surface }]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={[styles.ProfileImageText, { color: theme.primary }]}>
                  {displayName[0].toUpperCase()}
                </Text>
              )}
            </View>
            <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="camera" size={12} color="white" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.name, { color: theme.text }]}>
            {displayName}
          </Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>
            {user?.email}
          </Text>
        </View>

        {/* ACCOUNT SETTINGS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Account</Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.surface }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.surface }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* APP SETTINGS */}
        <View style={styles.section}>
  <Text style={[styles.sectionTitle, { color: theme.primary }]}>Preferences</Text>

  <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons 
        name={isDayMode ? "sunny" : "moon"} 
        size={18} 
        color={theme.primary} 
        style={{ marginRight: 10 }} 
      />
      <Text style={[styles.settingLabel, { color: theme.text }]}>Day Mode</Text>
    </View>
    
    <Switch
      value={isDayMode}
      onValueChange={toggleTheme} //  flips the switch for the WHOLE app
      trackColor={{ false: "#767577", true: theme.primary }}
      thumbColor={isDayMode ? "#fff" : "#f4f3f4"}
    />
  </View>
</View>

        {/* SIGN OUT & DELETE ACCOUNT */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, { backgroundColor: theme.surface, marginTop: 20 }]} 
            onPress={handleSignOut}
          >
            <Text style={[styles.settingLabel, { color: '#FF4B4B', fontWeight: 'bold' }]}>Sign Out</Text>
            <Ionicons name="log-out-outline" size={18} color="#FF4B4B" />
          </TouchableOpacity>

          <TouchableOpacity 
  onPress={handleDeleteAccount}
  style={[
    styles.settingItem, 
    { 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: '#FF4B4B', 
      marginTop: 10,
      justifyContent: 'center' 
    }
  ]}
>
  <Text style={[styles.settingLabel, { color: '#FF4B4B', textAlign: 'center', width: '100%' }]}>
    Delete Account
  </Text>
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