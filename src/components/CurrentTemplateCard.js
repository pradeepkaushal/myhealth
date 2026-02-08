import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function CurrentTemplateCard({ template }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Current Template</Text>
      {!template && <Text style={styles.emptyText}>No template selected yet.</Text>}
      {template && (
        <View>
          <Text style={styles.name}>{template.name}</Text>
          <Text style={styles.meta}>{template.goalMinutes} min · {template.description}</Text>
          <Text style={styles.activities}>{template.activities.join(" • ")}</Text>
        </View>
      )}
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
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  meta: {
    fontSize: 12,
    color: COLORS.subtleText,
    marginTop: 4,
  },
  activities: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
