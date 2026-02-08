import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ActivityTemplatesCard from "./ActivityTemplatesCard";
import { COLORS } from "../theme/colors";

export default function ActivityTemplatesScreen({ templates, onApplyTemplate, onViewTemplate, onBack }) {
  return (
    <View>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Activity Templates</Text>
        <Text style={styles.subtitle}>Pick a plan or create your own.</Text>
      </View>

      <ActivityTemplatesCard
        templates={templates}
        onApplyTemplate={onApplyTemplate}
        onViewTemplate={onViewTemplate}
      />

      <Pressable
        style={styles.primaryButton}
        onPress={() => Alert.alert("Coming soon", "Custom templates are on the way.")}
      >
        <Text style={styles.primaryButtonText}>Create Your Own Template</Text>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.subtleText,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
