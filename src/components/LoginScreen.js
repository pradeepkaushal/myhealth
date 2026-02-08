import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../theme/colors";

export default function LoginScreen({ onLogin, defaultUsername, defaultPassword }) {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState("");

  const handlePasswordLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("Enter a username and password.");
      return;
    }
    if (username !== defaultUsername || password !== defaultPassword) {
      setError("Invalid credentials. Try the default login.");
      return;
    }
    setError("");
    onLogin({ method: "password", displayName: username.trim() });
  };

  const handleProviderLogin = (method, displayName) => {
    setError("");
    onLogin({ method, displayName });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>myhealth</Text>
      <Text style={styles.subtitle}>Track daily activity and stay consistent.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>
        <Text style={styles.helperText}>Default: {defaultUsername} / {defaultPassword}</Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          placeholderTextColor={COLORS.subtleText}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={COLORS.subtleText}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={handlePasswordLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={[styles.secondaryButton, styles.googleButton]}
          onPress={() => handleProviderLogin("google", "Google User")}
        >
          <Text style={styles.secondaryButtonText}>Continue with Google</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, styles.mobileButton]}
          onPress={() => handleProviderLogin("mobile", "Mobile User")}
        >
          <Text style={styles.secondaryButtonText}>Continue with Mobile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.subtleText,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.subtleText,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.primaryDark,
    marginBottom: 10,
    backgroundColor: COLORS.inputBg,
  },
  errorText: {
    color: "#B63E3E",
    fontSize: 12,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  googleButton: {
    borderColor: "#D6E2E0",
  },
  mobileButton: {
    borderColor: "#CFE0DD",
  },
});
