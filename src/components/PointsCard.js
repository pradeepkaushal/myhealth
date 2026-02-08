import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function PointsCard({ points, minutes, sourceLabel }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Activity Points</Text>
      <View style={styles.pointsRow}>
        <Text style={styles.pointsValue}>{points}</Text>
        <Text style={styles.pointsUnit}>pts</Text>
      </View>
      <Text style={styles.metaText}>Captured from your phone activity</Text>
      <Text style={styles.metaSub}>Today: {minutes} min - {sourceLabel}</Text>
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
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  pointsUnit: {
    fontSize: 14,
    color: COLORS.subtleText,
    marginBottom: 6,
  },
  metaText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.subtleText,
  },
  metaSub: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.mutedText,
  },
});
