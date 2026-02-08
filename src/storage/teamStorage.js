import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export const loadTeams = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.teams);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

export const saveTeams = async (teams) => {
  await AsyncStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
};
