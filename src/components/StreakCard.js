import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function StreakCard({
  streak,
  lastCompleted,
  completedToday,
  onComplete,
}) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Streak</Text>
      <Text style={styles.streakNumber}>{streak} days</Text>
      <Text style={styles.meta}>Last completed: {lastCompleted}</Text>
      <Pressable
        style={[styles.primaryButton, completedToday && styles.primaryButtonDisabled]}
        onPress={onComplete}
        disabled={completedToday}
      >
        <Text style={styles.primaryButtonText}>
          {completedToday ? "Completed today" : "Mark today complete"}
        </Text>
      </Pressable>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  meta: {
    fontSize: 13,
    color: COLORS.subtleText,
    marginTop: 6,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
