import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function GoalCard({ goal, onChangeGoal, onSave, saving }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Your daily goal (minutes)</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={goal}
          onChangeText={onChangeGoal}
          placeholder="e.g. 20"
        />
        <Pressable style={styles.primaryButton} onPress={onSave} disabled={saving}>
          <Text style={styles.primaryButtonText}>{saving ? "Saving..." : "Save"}</Text>
        </Pressable>
      </View>
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
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
