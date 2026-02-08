import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";
import { calculatePoints, sumTotalMinutes } from "../../utils/activity";
import { getLevelForStreak } from "../../utils/levels";

export default function TeamDetailScreen({ team, onBack, onOpenMember }) {
  if (!team) return null;

  return (
    <View>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{team.name}</Text>
        <Text style={styles.meta}>{team.members.length} members</Text>
      </View>

      <SectionCard>
        <Text style={styles.sectionTitle}>Members</Text>
        {team.members.length === 0 && (
          <Text style={styles.emptyText}>No members yet. Add some in the Teams tab.</Text>
        )}
        {team.members.map((member) => {
          const totalMinutes = sumTotalMinutes(member.dailyActivity);
          const points = calculatePoints(member.dailyActivity, member.streak);
          return (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberMeta}>
                  {member.streak} day streak - {getLevelForStreak(member.streak)}
                </Text>
                <Text style={styles.memberMeta}>Total: {totalMinutes} min - {points} pts</Text>
              </View>
              <Pressable style={styles.profileButton} onPress={() => onOpenMember(member.id)}>
                <Text style={styles.profileButtonText}>View</Text>
              </Pressable>
            </View>
          );
        })}
      </SectionCard>
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
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.subtleText,
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
    fontSize: 15,
  },
  memberMeta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.subtleText,
  },
  profileButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "#FFFFFF",
  },
  profileButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
