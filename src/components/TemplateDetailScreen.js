import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function TemplateDetailScreen({ template, onBack, onApplyTemplate }) {
  if (!template) return null;

  const handleUseTemplate = () => {
    onApplyTemplate(template);
    if (onBack) onBack();
  };

  const activityDetails = template.details?.length
    ? template.details
    : template.activities.map((item) => ({ title: item, minutes: null, detail: "" }));

  return (
    <View>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{template.name}</Text>
        <View style={styles.goalBadge}>
          <Text style={styles.goalBadgeText}>{template.goalMinutes}m</Text>
        </View>
      </View>
      <Text style={styles.description}>{template.description}</Text>

      <SectionCard>
        <Text style={styles.sectionTitle}>Activity Plan</Text>
        {activityDetails.map((activity, index) => (
          <View key={`${template.id}-${index}`} style={styles.activityRow}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              {activity.minutes ? (
                <Text style={styles.activityMinutes}>{activity.minutes}m</Text>
              ) : null}
            </View>
            {activity.detail ? <Text style={styles.activityDetail}>{activity.detail}</Text> : null}
          </View>
        ))}
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Tips</Text>
        {template.tips?.map((tip, index) => (
          <Text key={`${template.id}-tip-${index}`} style={styles.tipText}>
            {index + 1}. {tip}
          </Text>
        ))}
      </SectionCard>

      <Pressable style={styles.primaryButton} onPress={handleUseTemplate}>
        <Text style={styles.primaryButtonText}>Use This Template</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  backText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.mutedText,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  goalBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  goalBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  description: {
    color: COLORS.subtleText,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  activityRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.inputBg,
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTitle: {
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  activityMinutes: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  activityDetail: {
    marginTop: 6,
    color: COLORS.subtleText,
    fontSize: 12,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.subtleText,
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
