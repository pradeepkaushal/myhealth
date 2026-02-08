import React from "react";
import { StyleSheet, Text } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function SuggestionCard({ suggestion }) {
  if (!suggestion) return null;

  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Today&apos;s suggestion</Text>
      <Text style={styles.title}>{suggestion.title}</Text>
      <Text style={styles.details}>{suggestion.details}</Text>
      <Text style={styles.meta}>Suggested duration: {suggestion.minutes} minutes</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  details: {
    fontSize: 15,
    color: COLORS.mutedText,
    marginTop: 6,
  },
  meta: {
    fontSize: 13,
    color: COLORS.subtleText,
    marginTop: 10,
  },
});
