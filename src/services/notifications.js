import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

export const ensureNotificationPermissions = async () => {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) {
    return true;
  }
  const request = await Notifications.requestPermissionsAsync();
  return request.granted || request.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
};

export const configureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("daily-reminders", {
    name: "Daily Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

export const scheduleDailyReminder = async (timeValue) => {
  const [hour, minute] = timeValue.split(":").map(Number);
  await configureAndroidChannel();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "myhealth reminder",
      body: "Time for your daily activity.",
      sound: null,
      channelId: "daily-reminders",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};

export const cancelReminder = async (reminderId) => {
  if (!reminderId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(reminderId);
  } catch (error) {
    // Ignore if it doesn't exist anymore.
  }
};
