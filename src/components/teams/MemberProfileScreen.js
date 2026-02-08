import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SectionCard from "../SectionCard";
import DailyActivityGraphCard from "../charts/DailyActivityGraphCard";
import { COLORS } from "../../theme/colors";
import { calculatePoints, getLastNDays, sumMinutesForDay, sumTotalMinutes } from "../../utils/activity";
import { getLevelForStreak } from "../../utils/levels";

const buildAchievements = (member, points, totalMinutes) => {
  const achievements = [];
  if (member.streak >= 7) achievements.push("7-day streak");
  if (member.streak >= 30) achievements.push("30-day streak");
  if (points >= 500) achievements.push("500 points milestone");
  if (points >= 1000) achievements.push("1,000 points milestone");
  if (totalMinutes >= 300) achievements.push("300 minutes logged");
  if (totalMinutes >= 600) achievements.push("600 minutes logged");
  return achievements;
};

export default function MemberProfileScreen({ member, onBack }) {
  if (!member) return null;

  const totalMinutes = sumTotalMinutes(member.dailyActivity);
  const points = calculatePoints(member.dailyActivity, member.streak);
  const weeklyMinutes = useMemo(() => {
    const days = getLastNDays(7);
    return days.reduce((sum, day) => sum + sumMinutesForDay(member.dailyActivity, day.key), 0);
  }, [member.dailyActivity]);
  const weeklyAverage = Math.round(weeklyMinutes / 7);
  const achievements = buildAchievements(member, points, totalMinutes);

  return (
    <View>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{member.name}</Text>
        <Text style={styles.subtitle}>{member.streak} day streak - {getLevelForStreak(member.streak)}</Text>
      </View>

      <SectionCard>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{weeklyAverage}</Text>
            <Text style={styles.statLabel}>Avg / day</Text>
          </View>
        </View>
      </SectionCard>

      <DailyActivityGraphCard member={member} />

      <SectionCard>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.length === 0 && (
          <Text style={styles.emptyText}>No achievements yet. Keep going!</Text>
        )}
        {achievements.map((achievement) => (
          <View key={achievement} style={styles.achievementRow}>
            <Text style={styles.achievementText}>{achievement}</Text>
          </View>
        ))}
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
  subtitle: {
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
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statBlock: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.subtleText,
  },
  achievementRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.inputBg,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
