import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActivityProgressCard from "./src/components/ActivityProgressCard";
import PointsCard from "./src/components/PointsCard";
import TeamChallengesCard from "./src/components/TeamChallengesCard";
import ActivityTemplatesCard from "./src/components/ActivityTemplatesCard";
import ActivityTemplatesScreen from "./src/components/ActivityTemplatesScreen";
import BottomNav from "./src/components/BottomNav";
import CurrentTemplateCard from "./src/components/CurrentTemplateCard";
import DailyActivityGraphCard from "./src/components/charts/DailyActivityGraphCard";
import DetailedActivityGraphCard from "./src/components/charts/DetailedActivityGraphCard";
import GoalCard from "./src/components/GoalCard";
import LoginScreen from "./src/components/LoginScreen";
import ProfileHeader from "./src/components/ProfileHeader";
import ReminderCard from "./src/components/ReminderCard";
import SectionCard from "./src/components/SectionCard";
import StreakCard from "./src/components/StreakCard";
import SuggestionCard from "./src/components/SuggestionCard";
import TemplateDetailScreen from "./src/components/TemplateDetailScreen";
import TeamListCard from "./src/components/teams/TeamListCard";
import TeamDetailPanel from "./src/components/teams/TeamDetailPanel";
import MemberProfileScreen from "./src/components/teams/MemberProfileScreen";
import TeamManagerCard from "./src/components/teams/TeamManagerCard";
import TeamMembersCard from "./src/components/teams/TeamMembersCard";
import TeamRankingCard from "./src/components/teams/TeamRankingCard";
import { ACTIVITY_TEMPLATES } from "./src/data/activityTemplates";
import { MOCK_TEAMS, MOCK_SUGGESTED_MEMBERS } from "./src/data/mockTeams";
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
import { calculatePointsFromMinutes, sumTotalMinutes } from "./src/utils/activity";
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
const DEFAULT_USERNAME = "myhealth";
const DEFAULT_PASSWORD = "myhealth123";
const DEFAULT_PROFILE_NAME = "Pradeep";
const PROFILE_PHOTO =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeScreen, setActiveScreen] = useState("main");
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState("");
  const [completedToday, setCompletedToday] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);
  const [reminderId, setReminderId] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUsername, setAuthUsername] = useState(DEFAULT_PROFILE_NAME);
  const [templateDetail, setTemplateDetail] = useState(null);
  const [teamDetailId, setTeamDetailId] = useState("");
  const [memberProfileId, setMemberProfileId] = useState("");

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
  const teamDetail = teams.find((team) => team.id === teamDetailId) || null;
  const memberProfile =
    teamDetail?.members.find((member) => member.id === memberProfileId) || null;
  const mockedMemberProfile = MOCK_SUGGESTED_MEMBERS.find((member) => member.id === memberProfileId) || null;
  const currentTemplate =
    ACTIVITY_TEMPLATES.find((template) => template.id === selectedTemplateId) || null;
  const goalMinutes = Number(goal) || 0;
  const phoneMinutes = completedToday ? goalMinutes : Math.round(goalMinutes * 0.4);
  const phonePoints = calculatePointsFromMinutes(phoneMinutes, streak);

  const homeDailyMinutes = useMemo(() => {
    const base = Math.max(6, Math.round(goalMinutes * 0.5));
    const offsets = [-3, 1, 0, 2, -1, 3];
    const history = offsets.map((offset) => Math.max(0, base + offset));
    return [...history, phoneMinutes];
  }, [goalMinutes, phoneMinutes, todayKey]);

  const teamSummaries = useMemo(() =>
    teams.map((team) => {
      const totalMinutes = team.members.reduce((sum, member) => sum + sumTotalMinutes(member.dailyActivity), 0);
      const totalStreak = team.members.reduce((sum, member) => sum + (member.streak || 0), 0);
      return {
        ...team,
        memberCount: team.members.length,
        points: calculatePointsFromMinutes(totalMinutes, totalStreak),
        totalMinutes,
      };
    }),
  [teams]);

  const teamChallenges = useMemo(() =>
    teamSummaries.map((team) => {
      const goalValue = Math.max(120, team.memberCount * 60);
      const progress = goalValue ? Math.min(100, Math.round((team.totalMinutes / goalValue) * 100)) : 0;
      return {
        id: `${team.id}-challenge`,
        title: `${team.name} Weekly Challenge`,
        subtitle: `${team.totalMinutes} / ${goalValue} min`,
        progress,
      };
    }),
  [teamSummaries]);

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
        STORAGE_KEYS.authLoggedIn,
        STORAGE_KEYS.authUsername,
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
      if (values[STORAGE_KEYS.authLoggedIn])
        setIsLoggedIn(values[STORAGE_KEYS.authLoggedIn] === "true");
      if (values[STORAGE_KEYS.authUsername])
        setAuthUsername(values[STORAGE_KEYS.authUsername]);

      const storedTeams = await loadTeams();
      const seededTeams = storedTeams.length ? storedTeams : MOCK_TEAMS;
      setTeams(seededTeams);
    };

    load().catch(() => {});
  }, []);

  useEffect(() => {
    setCompletedToday(lastCompleted === todayKey);
  }, [lastCompleted, todayKey]);

  useEffect(() => {
    setActiveScreen("main");
    setTemplateDetail(null);
    setTeamDetailId("");
    setMemberProfileId("");
  }, [activeTab]);

  useEffect(() => {
    saveTeams(teams).catch(() => {});
  }, [teams]);

  useEffect(() => {
    if (teamDetailId && !teamDetail) setTeamDetailId("");
    if (memberProfileId && !memberProfile && !mockedMemberProfile) setMemberProfileId("");
  }, [teamDetailId, teamDetail, memberProfileId, memberProfile, mockedMemberProfile]);

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

  const handleLogin = async ({ displayName }) => {
    const name = displayName || DEFAULT_PROFILE_NAME;
    setAuthUsername(name);
    setIsLoggedIn(true);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.authLoggedIn, "true"],
      [STORAGE_KEYS.authUsername, name],
    ]);
  };

  const handleViewTemplate = (template) => {
    setTemplateDetail(template);
    setTeamDetailId("");
    setMemberProfileId("");
    setActiveScreen("templateDetail");
  };

  const handleCloseTemplate = () => {
    setTemplateDetail(null);
    setActiveScreen("main");
  };

  const handleOpenTeam = (teamId) => {
    setTeamDetailId(teamId);
    setMemberProfileId("");
    setTemplateDetail(null);
    setActiveTab("teams");
    setActiveScreen("teamDetail");
  };

  const handleCloseTeamDetail = () => {
    setTeamDetailId("");
    setMemberProfileId("");
    setActiveScreen("main");
  };

  const handleOpenMemberProfile = (memberId) => {
    setMemberProfileId(memberId);
    setActiveScreen("memberProfile");
  };

  const handleCloseMemberProfile = () => {
    setMemberProfileId("");
    setActiveScreen("teamDetail");
  };

  const handleOpenSuggestedMember = (member) => {
    setMemberProfileId(member.id);
    setActiveScreen("memberProfile");
  };

  const handleOpenTemplateList = () => {
    setActiveScreen("templatesList");
  };

  const handleCloseTemplateList = () => {
    setActiveScreen("main");
  };

  const handleFocusMain = () => {
    setActiveScreen("main");
    setTemplateDetail(null);
    setTeamDetailId("");
    setMemberProfileId("");
  };


  if (!isLoggedIn) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <LoginScreen
          defaultUsername={DEFAULT_USERNAME}
          defaultPassword={DEFAULT_PASSWORD}
          onLogin={handleLogin}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <StatusBar style="dark" />
        <ProfileHeader name={authUsername} photoUri={PROFILE_PHOTO} />
        {activeScreen === "memberProfile" && (
          <MemberProfileScreen
            member={memberProfile || mockedMemberProfile}
            onBack={handleCloseMemberProfile}
          />
        )}
        {activeScreen === "teamDetail" && teamDetail && (
          <TeamDetailPanel
            team={teamDetail}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onOpenMember={handleOpenMemberProfile}
            suggestedMembers={MOCK_SUGGESTED_MEMBERS}
            onSelectSuggested={handleOpenSuggestedMember}
          />
        )}
        {activeScreen === "templatesList" && (
          <ActivityTemplatesScreen
            templates={ACTIVITY_TEMPLATES}
            onApplyTemplate={(template) => {
              handleApplyTemplate(template);
              handleCloseTemplateList();
            }}
            onViewTemplate={handleViewTemplate}
            onBack={handleCloseTemplateList}
          />
        )}
        {activeScreen === "templateDetail" && templateDetail && (
          <TemplateDetailScreen
            template={templateDetail}
            onBack={handleCloseTemplate}
            onApplyTemplate={handleApplyTemplate}
          />
        )}
        {activeScreen === "main" && activeTab === "home" && (
          <>
            <PointsCard points={phonePoints} minutes={phoneMinutes} sourceLabel="Auto capture" />
            <TeamChallengesCard challenges={teamChallenges} />
            <DailyActivityGraphCard dailyMinutes={homeDailyMinutes} />
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
        {activeScreen === "main" && activeTab === "activities" && (
          <>
            <Text style={styles.sectionTitle}>My Activities</Text>
            <Text style={styles.sectionSubtitle}>Plan your day and stay consistent.</Text>
            <SuggestionCard suggestion={suggestion} />
            <SectionCard>
              <Text style={styles.cardTitle}>Activity Templates</Text>
              <Text style={styles.helperText}>Browse curated templates or create your own.</Text>
              <Pressable style={styles.primaryButton} onPress={handleOpenTemplateList}>
                <Text style={styles.primaryButtonText}>Open Template Library</Text>
              </Pressable>
            </SectionCard>
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
        {activeScreen === "main" && activeTab === "teams" && (
          <>
            <Text style={styles.sectionTitle}>Teams</Text>
            <Text style={styles.sectionSubtitle}>Your teams and member progress.</Text>
            <TeamListCard teams={teamSummaries} onOpenTeam={handleOpenTeam} />
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
            <DetailedActivityGraphCard />
          </>
        )}
        {activeScreen === "main" && activeTab === "menu" && (
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
      <BottomNav activeTab={activeTab} onChange={setActiveTab} onFocusMain={handleFocusMain} />
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
