import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";

export default function BreadcrumbBar({ items, onPress }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item} style={styles.itemWrap}>
          <Pressable onPress={() => onPress(item)}>
            <Text style={styles.itemText}>{item}</Text>
          </Pressable>
          {index < items.length - 1 && <Text style={styles.separator}>/</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
  },
  itemWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  separator: {
    marginHorizontal: 8,
    color: COLORS.subtleText,
  },
});
