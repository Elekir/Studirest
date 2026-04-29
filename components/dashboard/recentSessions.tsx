import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface Session {
  id: string;
  moduleName: string;
  duration: number;
}

export default function RecentSessions({ sessions }: { sessions: Session[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Sessions</Text>
      {sessions.map((item) => (
        <View key={item.id} style={styles.sessionRow}>
          <Text style={styles.moduleName}>{item.moduleName}</Text>
          <Text style={styles.durationText}>{item.duration} min</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 25, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 15 },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  moduleName: { color: 'white', fontSize: 16 },
  durationText: { color: Colors.dark.textSecondary, fontSize: 16 },
});