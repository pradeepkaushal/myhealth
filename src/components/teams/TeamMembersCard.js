import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";
import { getLevelForStreak } from "../../utils/levels";

export default function TeamMembersCard({ team, onAddMember, onRemoveMember, onSelectMember, selectedMemberId }) {
  const [memberName, setMemberName] = useState("");

  if (!team) {
    return (
      <SectionCard>
        <Text style={styles.cardTitle}>Team Members</Text>
        <Text style={styles.emptyText}>Create a team to add members.</Text>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Team Members</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={memberName}
          onChangeText={setMemberName}
          placeholder="Member name"
        />
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (!memberName.trim()) return;
            onAddMember(team.id, memberName.trim());
            setMemberName("");
          }}
        >
          <Text style={styles.primaryButtonText}>Add</Text>
        </Pressable>
      </View>
      {team.members.length === 0 && <Text style={styles.emptyText}>No members yet.</Text>}
      {team.members.map((member) => (
        <View key={member.id} style={styles.memberRow}>
          <Pressable
            style={[styles.memberBadge, member.id === selectedMemberId && styles.memberBadgeActive]}
            onPress={() => onSelectMember(member.id)}
          >
            <Text style={[styles.memberText, member.id === selectedMemberId && styles.memberTextActive]}>
              {member.name}
            </Text>
          </Pressable>
          <View style={styles.metaRow}>
            <Text style={styles.streakText}>{member.streak} day streak</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>{getLevelForStreak(member.streak)}</Text>
            </View>
            <Pressable onPress={() => onRemoveMember(team.id, member.id)}>
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
  memberRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  memberBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.inputBg,
    alignSelf: "flex-start",
  },
  memberBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  memberText: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  memberTextActive: {
    color: "#FFFFFF",
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  streakText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
  levelPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
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
