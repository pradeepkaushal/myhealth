import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function ActivityProgressCard({ goalMinutes, completedToday }) {
  const goalValue = Number(goalMinutes) || 0;
  const isCompleted = Boolean(completedToday);
  const progressValue = isCompleted ? goalValue : 0;
  const progressRatio = goalValue > 0 ? Math.min(1, progressValue / goalValue) : 0;

  return (
    <SectionCard style={isCompleted ? styles.cardDisabled : null}>
      <Text style={styles.cardTitle}>Today&apos;s Goal</Text>
      <Text style={styles.metaText}>
        Goal: {goalValue || 0} min - {isCompleted ? "Completed" : "Not completed"}
      </Text>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            isCompleted ? styles.barFillCompleted : null,
            { width: `${progressRatio * 100}%` },
          ]}
        />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  cardDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.inputBg,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.subtleText,
    marginBottom: 10,
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.inputBg,
    overflow: "hidden",
  },
  barFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  barFillCompleted: {
    backgroundColor: COLORS.mutedText,
  },
});
