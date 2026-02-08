import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";

export default function TeamManagerCard({ teams, selectedTeamId, onCreateTeam, onRemoveTeam, onSelectTeam }) {
  const [teamName, setTeamName] = useState("");

  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Teams</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={teamName}
          onChangeText={setTeamName}
          placeholder="New team name"
        />
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (!teamName.trim()) return;
            onCreateTeam(teamName.trim());
            setTeamName("");
          }}
        >
          <Text style={styles.primaryButtonText}>Create</Text>
        </Pressable>
      </View>
      {teams.length === 0 && <Text style={styles.emptyText}>No teams yet.</Text>}
      {teams.map((team) => (
        <View key={team.id} style={styles.teamRow}>
          <Pressable
            style={[styles.teamBadge, team.id === selectedTeamId && styles.teamBadgeActive]}
            onPress={() => onSelectTeam(team.id)}
          >
            <Text style={[styles.teamBadgeText, team.id === selectedTeamId && styles.teamBadgeTextActive]}>
              {team.name}
            </Text>
          </Pressable>
          <View style={styles.teamMeta}>
            <Text style={styles.teamCount}>{team.members.length} members</Text>
            <Pressable onPress={() => onRemoveTeam(team.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
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
  teamRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  teamBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.inputBg,
    alignSelf: "flex-start",
  },
  teamBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  teamBadgeText: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  teamBadgeTextActive: {
    color: "#FFFFFF",
  },
  teamMeta: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamCount: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
  removeText: {
    color: "#B04A4A",
    fontSize: 12,
  },
  emptyText: {
    color: COLORS.subtleText,
    fontSize: 13,
  },
});
