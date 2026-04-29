import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Track Your Studies",
    description: "Monitor your progress with detailed charts and statistics.",
    image: require("../assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: "Stay Focused",
    description: "Use the deep work timer to eliminate distractions.",
    image: require("../assets/images/onboarding2.png"),
  },
  {
    id: 3,
    title: "Achieve Your Goals",
    description: "Set modules and hit your targets every single day.",
    image: require("../assets/images/onboarding3.png"),
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Check if a user session exists in Firebase
      if (auth.currentUser) {
        router.replace("/_tabs");
      } else {
        router.replace("/(auth)/login");
      }
    }
  };

  const data = slides[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* SKIP BUTTON */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image source={data.image} style={styles.image} resizeMode="contain" />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        {/* PROGRESS DOTS */}
        <View style={styles.dotContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentStep === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentStep === slides.length - 1 ? "GET STARTED" : "CONTINUE"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1135" },
  skipBtn: { alignSelf: "flex-end", padding: 20 },
  skipText: { color: "rgba(255,255,255,0.5)", fontSize: 16 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  image: { width: width * 0.9, height: 300, marginBottom: 20 },
  textContainer: { alignItems: "center", marginBottom: 30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 24,
  },
  dotContainer: { flexDirection: "row", marginBottom: 40 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 24, backgroundColor: "#FF71CE" },
  inactiveDot: { width: 8, backgroundColor: "rgba(255,255,255,0.2)" },
  button: {
    backgroundColor: "#FF71CE",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
