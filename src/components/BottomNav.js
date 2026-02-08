import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

export default function BottomNav({ activeTab, onChange, onFocusMain }) {
  const items = [
    { key: "activities", label: "My Activities", icon: "fitness" },
    { key: "home", label: "Home", icon: "home" },
    { key: "teams", label: "Teams", icon: "people" },
    { key: "menu", label: "Menu", icon: "menu" },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.container}>
        {items.map((item) => {
          const active = item.key === activeTab;
          const color = active ? "#FFFFFF" : COLORS.mutedText;
          return (
            <Pressable
              key={item.key}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => {
                if (onFocusMain) onFocusMain();
                onChange(item.key);
              }}
            >
              <Ionicons name={item.icon} size={18} color={color} />
              <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 999,
    padding: 6,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    gap: 4,
  },
  itemActive: {
    backgroundColor: COLORS.primary,
  },
  itemText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.mutedText,
  },
  itemTextActive: {
    color: "#FFFFFF",
  },
});
