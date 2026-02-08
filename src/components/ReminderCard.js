import React from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function ReminderCard({
  reminderTime,
  onChangeTime,
  enabled,
  onToggle,
  onUpdate,
  saving,
}) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Reminders</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={reminderTime}
          onChangeText={onChangeTime}
          placeholder="HH:MM"
          autoCapitalize="none"
        />
        <View style={styles.switchWrap}>
          <Text style={styles.switchLabel}>Enable</Text>
          <Switch value={enabled} onValueChange={onToggle} />
        </View>
      </View>
      <Pressable style={styles.secondaryButton} onPress={onUpdate} disabled={saving}>
        <Text style={styles.secondaryButtonText}>
          {saving ? "Updating..." : "Update reminder"}
        </Text>
      </Pressable>
      <Text style={styles.helperText}>
        Use 24-hour time (example: 07:30). Reminders repeat daily.
      </Text>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.primaryDark,
    backgroundColor: COLORS.inputBg,
  },
  switchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  switchLabel: {
    color: COLORS.mutedText,
  },
  secondaryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
