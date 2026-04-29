import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';


interface StatCardProps {
  label: string;
  value: string | number;
  icon: any; 
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 3; // Calculate width so 3 fit perfectly

export default function StatCard({ label, value, icon }: StatCardProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconCircle: {
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  }
});