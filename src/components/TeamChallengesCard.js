import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SectionCard from "./SectionCard";
import { COLORS } from "../theme/colors";

export default function TeamChallengesCard({ challenges }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Team Challenges</Text>
      {(!challenges || challenges.length === 0) && (
        <Text style={styles.emptyText}>Join a team to see ongoing challenges.</Text>
      )}
      {challenges?.map((challenge) => (
        <View key={challenge.id} style={styles.challengeRow}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeMeta}>{challenge.progress}%</Text>
          </View>
          <Text style={styles.challengeSub}>{challenge.subtitle}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${challenge.progress}%` }]} />
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
  challengeRow: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.inputBg,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  challengeTitle: {
    fontWeight: "700",
    color: COLORS.primaryDark,
    fontSize: 14,
  },
  challengeMeta: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
  challengeSub: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.mutedText,
  },
  progressTrack: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
});
