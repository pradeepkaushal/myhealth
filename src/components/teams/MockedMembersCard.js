import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";
import { calculatePoints, sumTotalMinutes } from "../../utils/activity";
import { getLevelForStreak } from "../../utils/levels";

export default function MockedMembersCard({ members, onSelect }) {
  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Suggested Members</Text>
      {(!members || members.length === 0) && (
        <Text style={styles.emptyText}>No suggested members right now.</Text>
      )}
      {members?.map((member) => {
        const totalMinutes = sumTotalMinutes(member.dailyActivity);
        const points = calculatePoints(member.dailyActivity, member.streak);
        return (
          <Pressable key={member.id} style={styles.memberRow} onPress={() => onSelect(member)}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberMeta}>
                {member.streak} day streak - {getLevelForStreak(member.streak)}
              </Text>
              <Text style={styles.memberMeta}>Total: {totalMinutes} min - {points} pts</Text>
            </View>
            <Text style={styles.viewText}>View</Text>
          </Pressable>
        );
      })}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.subtleText,
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
  viewText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
