import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from "react-native-svg";
import { Colors } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Define the size of the box the circle sits in
const SIZE = SCREEN_WIDTH * 0.85; 
const CENTER = SIZE / 2;
const CIRCLE_LENGTH = 800; 
const R = CIRCLE_LENGTH / (2 * Math.PI);

interface TimerDisplayProps {
  seconds: number;
  totalTime: number;
  formattedTime: string;
}

export default function TimerDisplay({ seconds, totalTime, formattedTime }: TimerDisplayProps) {
  const strokeDashoffset = CIRCLE_LENGTH * (1 - seconds / totalTime);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* Background Circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={15}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          stroke={Colors.dark.primary}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          // This rotates the start point to the top
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.timerText}>{formattedTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "white",
  },
});