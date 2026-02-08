import React, { useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";
import { getLastNDays } from "../../utils/activity";

const chartWidth = Dimensions.get("window").width - 72;

const MOCK_MEMBERS = [
  {
    id: "alex",
    name: "Alex",
    goal: 30,
    actual: [18, 24, 20, 28, 30, 26, 32],
  },
  {
    id: "jamie",
    name: "Jamie",
    goal: 25,
    actual: [12, 18, 20, 22, 24, 21, 26],
  },
  {
    id: "sam",
    name: "Sam",
    goal: 20,
    actual: [10, 12, 16, 18, 20, 14, 22],
  },
];

const normalizeSeries = (values, length, fillValue = 0) => {
  const copy = values.slice(0, length);
  while (copy.length < length) copy.push(fillValue);
  return copy;
};

export default function DetailedActivityGraphCard() {
  const [activeMemberId, setActiveMemberId] = useState(MOCK_MEMBERS[0].id);
  const days = useMemo(() => getLastNDays(7), []);
  const member = MOCK_MEMBERS.find((item) => item.id === activeMemberId) || MOCK_MEMBERS[0];

  const actualData = normalizeSeries(member.actual, days.length);
  const goalData = normalizeSeries(new Array(days.length).fill(member.goal), days.length);

  const chartData = {
    labels: days.map((day) => day.label),
    datasets: [
      {
        data: actualData,
        color: (opacity = 1) => `rgba(10, 107, 100, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: goalData,
        color: (opacity = 1) => `rgba(74, 91, 89, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Actual", "Goal"],
  };

  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Detailed Activity Graph</Text>
      <Text style={styles.summaryText}>Mocked data for the last 7 days.</Text>

      <View style={styles.toggleRow}>
        {MOCK_MEMBERS.map((item) => {
          const active = item.id === activeMemberId;
          return (
            <Pressable
              key={item.id}
              style={[styles.toggleChip, active && styles.toggleChipActive]}
              onPress={() => setActiveMemberId(item.id)}
            >
              <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chartWrap}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          fromZero
          bezier
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
    </SectionCard>
  );
}

const chartConfig = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(10, 107, 100, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(74, 91, 89, ${opacity})`,
  propsForLabels: {
    fontSize: 10,
  },
  propsForDots: {
    r: "4",
  },
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.mutedText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 12,
    color: COLORS.subtleText,
  },
  toggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  toggleChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.card,
  },
  toggleChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 12,
    color: COLORS.mutedText,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  chartWrap: {
    marginTop: 14,
    alignItems: "center",
  },
  chart: {
    borderRadius: 12,
  },
});
