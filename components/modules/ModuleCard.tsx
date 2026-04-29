import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";


// Defining the shape of the data this component needs
interface ModuleCardProps {
  name: string;
  color: string;
  onPress: () => void; // A function to trigger the edit modal
}

export default function ModuleCard({ name, color, onPress }: ModuleCardProps) {
    const { theme } = useTheme();
  return (
    <TouchableOpacity style={[
        styles.moduleCard, 
        { backgroundColor: theme.surface }
      ]} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.moduleName, { color: theme.text }]}>{name}</Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.textSecondary}
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  moduleName: { fontSize: 18, fontWeight: "500" },
});