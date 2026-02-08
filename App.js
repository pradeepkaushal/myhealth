import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoalCard from "./src/components/GoalCard";
import ReminderCard from "./src/components/ReminderCard";
import StreakCard from "./src/components/StreakCard";
import SuggestionCard from "./src/components/SuggestionCard";
import { SUGGESTIONS } from "./src/data/suggestions";
import {
  cancelReminder,
  configureNotificationHandler,
  ensureNotificationPermissions,
  scheduleDailyReminder,
} from "./src/services/notifications";
import { STORAGE_KEYS } from "./src/storage/keys";
import { COLORS } from "./src/theme/colors";
import {
  addDays,
  dayOfYear,
  formatFriendlyDate,
  getLocalDateKey,
  isValidTime,
} from "./src/utils/date";

const DEFAULT_GOAL = "20";
const DEFAULT_REMINDER_TIME = "20:00";

export default function App() {
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState("");
  const [completedToday, setCompletedToday] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);
  const [reminderId, setReminderId] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);

  const todayKey = getLocalDateKey(new Date());
  const suggestion = useMemo(() => {
    const index = dayOfYear(new Date()) % SUGGESTIONS.length;
    return SUGGESTIONS[index];
  }, [todayKey]);

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
      ]);
      const values = Object.fromEntries(entries);
      if (values[STORAGE_KEYS.goal]) setGoal(values[STORAGE_KEYS.goal]);
      if (values[STORAGE_KEYS.streak]) setStreak(Number(values[STORAGE_KEYS.streak]) || 0);
      if (values[STORAGE_KEYS.lastCompleted]) setLastCompleted(values[STORAGE_KEYS.lastCompleted]);
      if (values[STORAGE_KEYS.reminderEnabled])
        setReminderEnabled(values[STORAGE_KEYS.reminderEnabled] === "true");
      if (values[STORAGE_KEYS.reminderTime]) setReminderTime(values[STORAGE_KEYS.reminderTime]);
      if (values[STORAGE_KEYS.reminderId]) setReminderId(values[STORAGE_KEYS.reminderId]);
    };

    load().catch(() => {});
  }, []);

  useEffect(() => {
    setCompletedToday(lastCompleted === todayKey);
  }, [lastCompleted, todayKey]);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <Text style={styles.title}>myhealth</Text>
      <Text style={styles.subtitle}>Daily Physical Activity Tracker</Text>

      <SuggestionCard suggestion={suggestion} />
      <GoalCard
        goal={goal}
        onChangeGoal={setGoal}
        onSave={handleSaveGoal}
        saving={savingGoal}
      />
      <StreakCard
        streak={streak}
        lastCompleted={formatFriendlyDate(lastCompleted)}
        completedToday={completedToday}
        onComplete={handleCompleteToday}
      />
      <ReminderCard
        reminderTime={reminderTime}
        onChangeTime={setReminderTime}
        enabled={reminderEnabled}
        onToggle={handleToggleReminder}
        onUpdate={handleUpdateReminder}
        saving={savingReminder}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Consistency beats intensity.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mutedText,
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    color: COLORS.subtleText,
    fontSize: 12,
  },
});
