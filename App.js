import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivityProgressCard from "./src/components/ActivityProgressCard";
import ActivityTemplatesCard from "./src/components/ActivityTemplatesCard";
import BottomNav from "./src/components/BottomNav";
import CurrentTemplateCard from "./src/components/CurrentTemplateCard";
import DailyActivityGraphCard from "./src/components/charts/DailyActivityGraphCard";
import GoalCard from "./src/components/GoalCard";
import ProfileHeader from "./src/components/ProfileHeader";
import ReminderCard from "./src/components/ReminderCard";
import SectionCard from "./src/components/SectionCard";
import StreakCard from "./src/components/StreakCard";
import SuggestionCard from "./src/components/SuggestionCard";
import TeamManagerCard from "./src/components/teams/TeamManagerCard";
import TeamMembersCard from "./src/components/teams/TeamMembersCard";
import TeamRankingCard from "./src/components/teams/TeamRankingCard";
import { ACTIVITY_TEMPLATES } from "./src/data/activityTemplates";
import { SUGGESTIONS } from "./src/data/suggestions";
import {
  cancelReminder,
  configureNotificationHandler,
  ensureNotificationPermissions,
  scheduleDailyReminder,
} from "./src/services/notifications";
import { STORAGE_KEYS } from "./src/storage/keys";
import { loadTeams, saveTeams } from "./src/storage/teamStorage";
import { COLORS } from "./src/theme/colors";
import {
  addDays,
  dayOfYear,
  formatFriendlyDate,
  getLocalDateKey,
  isValidTime,
} from "./src/utils/date";
import { addMemberToTeam, createTeam, logMemberActivity, removeMemberFromTeam } from "./src/modules/teams";

const DEFAULT_GOAL = "20";
const DEFAULT_REMINDER_TIME = "20:00";
const PROFILE_PHOTO =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState("");
  const [completedToday, setCompletedToday] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);
  const [reminderId, setReminderId] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [memberMinutes, setMemberMinutes] = useState("15");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const todayKey = getLocalDateKey(new Date());
  const suggestion = useMemo(() => {
    const index = dayOfYear(new Date()) % SUGGESTIONS.length;
    return SUGGESTIONS[index];
  }, [todayKey]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) || null;
  const selectedMember = selectedTeam?.members.find((member) => member.id === selectedMemberId) || null;
  const canLogMember = Boolean(selectedTeam && selectedMember);
  const currentTemplate =
    ACTIVITY_TEMPLATES.find((template) => template.id === selectedTemplateId) || null;

  useEffect(() => {
    configureNotificationHandler();
    const load = async () => {
      const entries = await AsyncStorage.multiGet([
        STORAGE_KEYS.goal,
        STORAGE_KEYS.streak,
        STORAGE_KEYS.lastCompleted,
        STORAGE_KEYS.reminderEnabled,
        STORAGE_KEYS.reminderTime,
        STORAGE_KEYS.reminderId,
        STORAGE_KEYS.selectedTeamId,
        STORAGE_KEYS.selectedMemberId,
        STORAGE_KEYS.selectedTemplateId,
      ]);
      const values = Object.fromEntries(entries);
      if (values[STORAGE_KEYS.goal]) setGoal(values[STORAGE_KEYS.goal]);
      if (values[STORAGE_KEYS.streak]) setStreak(Number(values[STORAGE_KEYS.streak]) || 0);
      if (values[STORAGE_KEYS.lastCompleted]) setLastCompleted(values[STORAGE_KEYS.lastCompleted]);
      if (values[STORAGE_KEYS.reminderEnabled])
        setReminderEnabled(values[STORAGE_KEYS.reminderEnabled] === "true");
      if (values[STORAGE_KEYS.reminderTime]) setReminderTime(values[STORAGE_KEYS.reminderTime]);
      if (values[STORAGE_KEYS.reminderId]) setReminderId(values[STORAGE_KEYS.reminderId]);
      if (values[STORAGE_KEYS.selectedTeamId]) setSelectedTeamId(values[STORAGE_KEYS.selectedTeamId]);
      if (values[STORAGE_KEYS.selectedMemberId])
        setSelectedMemberId(values[STORAGE_KEYS.selectedMemberId]);
      if (values[STORAGE_KEYS.selectedTemplateId])
        setSelectedTemplateId(values[STORAGE_KEYS.selectedTemplateId]);

      const storedTeams = await loadTeams();
      setTeams(storedTeams);
    };

    load().catch(() => {});
  }, []);

  useEffect(() => {
    setCompletedToday(lastCompleted === todayKey);
  }, [lastCompleted, todayKey]);

  useEffect(() => {
    saveTeams(teams).catch(() => {});
  }, [teams]);

  const handleSaveGoal = async () => {
    const trimmed = goal.trim();
    if (!trimmed || Number.isNaN(Number(trimmed))) {
      Alert.alert("Goal needed", "Enter your daily goal in minutes.");
      return;
    }
    setSavingGoal(true);
    await AsyncStorage.setItem(STORAGE_KEYS.goal, trimmed);
    setSavingGoal(false);
  };

  const handleCompleteToday = async () => {
    if (completedToday) return;
    const yesterdayKey = getLocalDateKey(addDays(new Date(), -1));
    const nextStreak = lastCompleted === yesterdayKey ? streak + 1 : 1;
    const nextLastCompleted = todayKey;

    setStreak(nextStreak);
    setLastCompleted(nextLastCompleted);

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.streak, String(nextStreak)],
      [STORAGE_KEYS.lastCompleted, nextLastCompleted],
    ]);
  };

  const handleToggleReminder = async (value) => {
    if (value) {
      if (!isValidTime(reminderTime)) {
        Alert.alert("Time format", "Use 24-hour time like 07:30 or 19:00.");
        return;
      }
      setSavingReminder(true);
      const allowed = await ensureNotificationPermissions();
      if (!allowed) {
        Alert.alert("Permission needed", "Enable notifications to use reminders.");
        setSavingReminder(false);
        return;
      }
      await cancelReminder(reminderId);
      const newId = await scheduleDailyReminder(reminderTime);
      setReminderId(newId);
      setReminderEnabled(true);
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.reminderEnabled, "true"],
        [STORAGE_KEYS.reminderId, newId],
        [STORAGE_KEYS.reminderTime, reminderTime],
      ]);
      setSavingReminder(false);
      return;
    }

    setSavingReminder(true);
    await cancelReminder(reminderId);
    setReminderEnabled(false);
    setReminderId("");
    await AsyncStorage.setItem(STORAGE_KEYS.reminderId, "");
    await AsyncStorage.setItem(STORAGE_KEYS.reminderEnabled, "false");
    setSavingReminder(false);
  };

  const handleUpdateReminder = async () => {
    if (!reminderEnabled) {
      Alert.alert("Reminders off", "Turn on reminders to set a time.");
      return;
    }
    if (!isValidTime(reminderTime)) {
      Alert.alert("Time format", "Use 24-hour time like 07:30 or 19:00.");
      return;
    }
    setSavingReminder(true);
    await cancelReminder(reminderId);
    const newId = await scheduleDailyReminder(reminderTime);
    setReminderId(newId);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.reminderId, newId],
      [STORAGE_KEYS.reminderTime, reminderTime],
    ]);
    setSavingReminder(false);
  };

  const handleCreateTeam = async (name) => {
    const nextTeam = createTeam(name);
    const nextTeams = [...teams, nextTeam];
    setTeams(nextTeams);
    setSelectedTeamId(nextTeam.id);
    await AsyncStorage.setItem(STORAGE_KEYS.selectedTeamId, nextTeam.id);
  };

  const handleRemoveTeam = async (teamId) => {
    const nextTeams = teams.filter((team) => team.id !== teamId);
    setTeams(nextTeams);
    if (selectedTeamId === teamId) {
      setSelectedTeamId("");
      setSelectedMemberId("");
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.selectedTeamId, ""],
        [STORAGE_KEYS.selectedMemberId, ""],
      ]);
    }
  };

  const handleSelectTeam = async (teamId) => {
    setSelectedTeamId(teamId);
    setSelectedMemberId("");
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.selectedTeamId, teamId],
      [STORAGE_KEYS.selectedMemberId, ""],
    ]);
  };

  const handleAddMember = (teamId, name) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? addMemberToTeam(team, name) : team))
    );
  };

  const handleRemoveMember = (teamId, memberId) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? removeMemberFromTeam(team, memberId) : team))
    );
    if (selectedMemberId === memberId) {
      setSelectedMemberId("");
      AsyncStorage.setItem(STORAGE_KEYS.selectedMemberId, "");
    }
  };

  const handleSelectMember = async (memberId) => {
    setSelectedMemberId(memberId);
    await AsyncStorage.setItem(STORAGE_KEYS.selectedMemberId, memberId);
  };

  const handleLogMemberActivity = () => {
    if (!selectedTeam || !selectedMember) return;
    const minutes = Number(memberMinutes);
    if (!minutes || Number.isNaN(minutes)) {
      Alert.alert("Minutes needed", "Enter activity minutes for the member.");
      return;
    }
    setTeams((prev) =>
      prev.map((team) =>
        team.id === selectedTeam.id ? logMemberActivity(team, selectedMember.id, minutes) : team
      )
    );
  };

  const handleApplyTemplate = async (template) => {
    setGoal(String(template.goalMinutes));
    setSelectedTemplateId(template.id);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.goal, String(template.goalMinutes)],
      [STORAGE_KEYS.selectedTemplateId, template.id],
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <StatusBar style="dark" />
        <ProfileHeader name="Pradeep" photoUri={PROFILE_PHOTO} />
        {activeTab === "home" && (
          <>
            <ActivityProgressCard goalMinutes={goal} completedToday={completedToday} />
            <StreakCard
              streak={streak}
              lastCompleted={formatFriendlyDate(lastCompleted)}
              completedToday={completedToday}
              onComplete={handleCompleteToday}
            />
            <CurrentTemplateCard template={currentTemplate} />
          </>
        )}

        {activeTab === "activities" && (
          <>
            <Text style={styles.sectionTitle}>My Activities</Text>
            <Text style={styles.sectionSubtitle}>Plan your day and stay consistent.</Text>
            <SuggestionCard suggestion={suggestion} />
            <ActivityTemplatesCard templates={ACTIVITY_TEMPLATES} onApplyTemplate={handleApplyTemplate} />
            <GoalCard
              goal={goal}
              onChangeGoal={setGoal}
              onSave={handleSaveGoal}
              saving={savingGoal}
            />
            <ReminderCard
              reminderTime={reminderTime}
              onChangeTime={setReminderTime}
              enabled={reminderEnabled}
              onToggle={handleToggleReminder}
              onUpdate={handleUpdateReminder}
              saving={savingReminder}
            />
          </>
        )}

        {activeTab === "teams" && (
          <>
            <Text style={styles.sectionTitle}>Teams</Text>
            <Text style={styles.sectionSubtitle}>Create teams, add members, and track consistency.</Text>
            <TeamManagerCard
              teams={teams}
              selectedTeamId={selectedTeamId}
              onCreateTeam={handleCreateTeam}
              onRemoveTeam={handleRemoveTeam}
              onSelectTeam={handleSelectTeam}
            />
            <TeamMembersCard
              team={selectedTeam}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onSelectMember={handleSelectMember}
              selectedMemberId={selectedMemberId}
            />
            <TeamRankingCard team={selectedTeam} />

            <SectionCard>
              <Text style={styles.cardTitle}>Log Member Activity</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  value={memberMinutes}
                  onChangeText={setMemberMinutes}
                  placeholder="Minutes"
                  keyboardType="number-pad"
                />
                <Pressable
                  style={[styles.primaryButton, !canLogMember && styles.primaryButtonDisabled]}
                  onPress={handleLogMemberActivity}
                  disabled={!canLogMember}
                >
                  <Text style={styles.primaryButtonText}>Log</Text>
                </Pressable>
              </View>
              <Text style={styles.helperText}>
                {canLogMember ? "Logging for selected member." : "Select a member above to log minutes."}
              </Text>
            </SectionCard>

            <DailyActivityGraphCard member={selectedMember} />
          </>
        )}


        {activeTab === "menu" && (
          <>
            <Text style={styles.sectionTitle}>Menu</Text>
            <Text style={styles.sectionSubtitle}>Quick actions and preferences.</Text>
            <SectionCard>
              {["Settings", "Privacy Policy", "Share the app"].map((item) => (
                <Pressable
                  key={item}
                  style={styles.menuRow}
                  onPress={() => Alert.alert(item, "Coming soon.")}
                >
                  <Text style={styles.menuText}>{item}</Text>
                </Pressable>
              ))}
            </SectionCard>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Consistency beats intensity.</Text>
        </View>
      </ScrollView>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.subtleText,
    marginBottom: 12,
  },
  footer: {
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    color: COLORS.subtleText,
    fontSize: 12,
  },
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.subtleText,
  },
});
