import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import SectionCard from "../SectionCard";
import { COLORS } from "../../theme/colors";
import { getLastNDays, sumMinutesForDay } from "../../utils/activity";

const chartWidth = Dimensions.get("window").width - 72;

export default function DailyActivityGraphCard({ member, dailyMinutes }) {
  const days = getLastNDays(7);
  const safeMinutes = Array.isArray(dailyMinutes) ? dailyMinutes : [];
  const dataPoints =
    safeMinutes.length === days.length
      ? safeMinutes
      : days.map((day, index) =>
          safeMinutes[index] ?? (member ? sumMinutesForDay(member.dailyActivity, day.key) : 0)
        );
  const hasData = dataPoints.some((value) => value > 0);
  const total = dataPoints.reduce((sum, value) => sum + value, 0);
  const average = Math.round(total / dataPoints.length);

  const chartData = {
    labels: days.map((day) => day.label),
    datasets: [{ data: dataPoints }],
  };

  return (
    <SectionCard>
      <Text style={styles.cardTitle}>Daily Activity Graph</Text>
      <Text style={styles.summaryText}>7-day total {total}m · avg {average}m</Text>
      <View style={styles.chartWrap}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={200}
          fromZero
          showValuesOnTopOfBars
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      {!hasData && <Text style={styles.emptyText}>No activity captured yet.</Text>}
    </SectionCard>
  );
}

const chartConfig = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(10, 107, 100, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(74, 91, 89, ${opacity})`,
  barPercentage: 0.6,
  propsForLabels: {
    fontSize: 10,
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
  chartWrap: {
    marginTop: 12,
    alignItems: "center",
  },
  chart: {
    borderRadius: 12,
  },
  emptyText: {
    color: COLORS.subtleText,
    fontSize: 13,
    marginTop: 8,
  },
});
