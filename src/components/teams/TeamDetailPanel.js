import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import SectionCard from "../SectionCard";
import MockedMembersCard from "./MockedMembersCard";
import { COLORS } from "../../theme/colors";
import { calculatePoints, sumTotalMinutes } from "../../utils/activity";
import { getLevelForStreak } from "../../utils/levels";

export default function TeamDetailPanel({
  team,
  onAddMember,
  onRemoveMember,
  onOpenMember,
  suggestedMembers,
  onSelectSuggested,
}) {
  const [memberName, setMemberName] = useState("");

  const membersWithPoints = useMemo(() =>
    team
      ? team.members.map((member) => {
          const totalMinutes = sumTotalMinutes(member.dailyActivity);
          return {
            ...member,
            totalMinutes,
            points: calculatePoints(member.dailyActivity, member.streak),
          };
        })
      : [],
  [team]);

  if (!team) return null;

  return (
    <View>
      <SectionCard>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{team.name}</Text>
            <Text style={styles.meta}>{team.members.length} members</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={memberName}
            onChangeText={setMemberName}
            placeholder="Add member name"
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
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Members</Text>
        {membersWithPoints.length === 0 && (
          <Text style={styles.emptyText}>No members yet.</Text>
        )}
        {membersWithPoints.map((member) => (
          <View key={member.id} style={styles.memberRow}>
            <Pressable style={styles.memberInfo} onPress={() => onOpenMember(member.id)}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberMeta}>
                {member.streak} day streak - {getLevelForStreak(member.streak)}
              </Text>
              <Text style={styles.memberMeta}>
                Total: {member.totalMinutes} min - {member.points} pts
              </Text>
            </Pressable>
            <Pressable onPress={() => onRemoveMember(team.id, member.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </SectionCard>

      <MockedMembersCard members={suggestedMembers} onSelect={onSelectSuggested} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.subtleText,
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
    fontSize: 15,
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  memberRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.inputBg,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  memberMeta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.subtleText,
  },
  removeText: {
    color: "#B04A4A",
    fontSize: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
