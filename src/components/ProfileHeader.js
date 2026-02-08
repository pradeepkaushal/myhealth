import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";

export default function ProfileHeader({ name, photoUri }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Image source={{ uri: photoUri }} style={styles.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 14,
    backgroundColor: COLORS.inputBg,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.subtleText,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
});
