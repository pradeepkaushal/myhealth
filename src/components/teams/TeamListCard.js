import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";

export default function TeamListCard({ teams, onOpenTeam }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Teams I'm Part Of</Text>
      {(!teams || teams.length === 0) && (
        <Text style={styles.emptyText}>You are not part of any team yet.</Text>
      )}
      {teams?.map((team) => (
        <Pressable key={team.id} style={styles.teamRow} onPress={() => onOpenTeam(team.id)}>
          <View>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamMeta}>{team.memberCount} members</Text>
          </View>
          <View style={styles.pointsWrap}>
            <Text style={styles.pointsValue}>{team.points}</Text>
            <Text style={styles.pointsLabel}>pts</Text>
          </View>
        </Pressable>
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
    fontSize: 12,
    color: COLORS.subtleText,
  },
  teamRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.inputBg,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamName: {
    fontWeight: "700",
    color: COLORS.primaryDark,
    fontSize: 15,
  },
  teamMeta: {
    fontSize: 12,
    color: COLORS.subtleText,
    marginTop: 4,
  },
  pointsWrap: {
    alignItems: "flex-end",
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  pointsLabel: {
    fontSize: 11,
    color: COLORS.subtleText,
  },
});
