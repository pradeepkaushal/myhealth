import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";
import { getLevelForStreak } from "../../utils/levels";

export default function TeamRankingCard({ team }) {
  if (!team) {
    return (
      <SectionCard>
        <Text style={styles.cardTitle}>Team Ranking</Text>
        <Text style={styles.emptyText}>Create a team to see rankings.</Text>
      </SectionCard>
    );
  }

  const sorted = [...team.members].sort((a, b) => b.streak - a.streak);

  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Team Ranking</Text>
      {sorted.length === 0 && <Text style={styles.emptyText}>No members to rank.</Text>}
      {sorted.map((member, index) => (
        <View key={member.id} style={styles.rankRow}>
          <View style={[styles.rankBadge, index < 3 && styles.rankBadgeTop]}>
            <Text style={styles.rankIndex}>{index + 1}</Text>
          </View>
          <View style={styles.rankInfo}>
            <Text style={styles.rankName}>{member.name}</Text>
            <Text style={styles.rankMeta}>
              {member.streak} day streak · {getLevelForStreak(member.streak)}
            </Text>
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
  emptyText: {
    color: COLORS.subtleText,
    fontSize: 13,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeTop: {
    backgroundColor: COLORS.primary,
  },
  rankIndex: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  rankInfo: {
    marginLeft: 10,
  },
  rankName: {
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  rankMeta: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
