import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function ActivityTemplatesCard({ templates, onApplyTemplate, onViewTemplate }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Activity Templates</Text>
      {templates.map((template) => (
        <View key={template.id} style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Text style={styles.templateName}>{template.name}</Text>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>{template.goalMinutes}m</Text>
            </View>
          </View>
          <Text style={styles.templateMeta}>{template.description}</Text>
          <Text style={styles.templateActivities}>{template.activities.join(" • ")}</Text>
          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={() => onApplyTemplate(template)}>
              <Text style={styles.secondaryButtonText}>Use Template</Text>
            </Pressable>
            {onViewTemplate && (
              <Pressable style={styles.ghostButton} onPress={() => onViewTemplate(template)}>
                <Text style={styles.ghostButtonText}>View Details</Text>
              </Pressable>
            )}
          </View>
        </View>
      ))}
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
  templateCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    backgroundColor: COLORS.inputBg,
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  templateName: {
    fontWeight: "700",
    color: COLORS.primaryDark,
    fontSize: 16,
  },
  goalBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  goalBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  templateMeta: {
    fontSize: 12,
    color: COLORS.subtleText,
    marginTop: 6,
  },
  templateActivities: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  ghostButtonText: {
    color: COLORS.mutedText,
    fontWeight: "600",
  },
});
