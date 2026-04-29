import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from "react-native-chart-kit"; 
import { Colors } from '../../constants/theme';

const screenWidth = Dimensions.get("window").width;

export default function WeeklyChart({ dataValues }: { dataValues: number[] }) {
  
  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [{ data: dataValues }] // Hours studied
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Progress (Hours)</Text>
      <BarChart
        data={data}
        width={screenWidth - 40} // Chart width minus padding
        height={220}
        yAxisLabel=""
        yAxisSuffix="h"
        chartConfig={{
          backgroundColor: Colors.dark.background,
          backgroundGradientFrom: Colors.dark.surface,
          backgroundGradientTo: Colors.dark.surface,
          decimalPlaces: 1, 
          color: () => `#FF71CE`, 
          fillShadowGradient: `#FF71CE`, // This fills the bar
          fillShadowGradientOpacity: 1,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, 0.8)`,
          style: { borderRadius: 16 },
          barPercentage: 0.6,
          propsForDots: { r: "6", strokeWidth: "2", stroke: Colors.dark.primary }
        }}
        verticalLabelRotation={0}
        style={{ marginVertical: 8, borderRadius: 16 }}
        showValuesOnTopOfBars={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, alignItems: 'center' },
  title: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
  }
});