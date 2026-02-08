export const ACTIVITY_TEMPLATES = [
  {
    id: "foundation",
    name: "Foundation",
    goalMinutes: 20,
    description: "Simple daily movement for beginners.",
    activities: ["Brisk walk", "Light stretch", "Easy mobility"],
    details: [
      { title: "Brisk walk", minutes: 10, detail: "Keep a steady pace that warms you up." },
      { title: "Light stretch", minutes: 5, detail: "Focus on calves, hamstrings, and shoulders." },
      { title: "Easy mobility", minutes: 5, detail: "Gentle hip circles and ankle rolls." },
    ],
    tips: [
      "Start slow and build consistency over intensity.",
      "Breathe through each movement.",
      "End with a glass of water.",
    ],
  },
  {
    id: "endurance",
    name: "Endurance",
    goalMinutes: 30,
    description: "Steady cardio and stamina building.",
    activities: ["Jogging", "Cycling", "Stair climb"],
    details: [
      { title: "Jogging", minutes: 12, detail: "Keep a conversational pace." },
      { title: "Cycling", minutes: 10, detail: "Flat route or light resistance." },
      { title: "Stair climb", minutes: 8, detail: "Slow climbs, controlled steps." },
    ],
    tips: [
      "Warm up for 3 minutes before the first push.",
      "Maintain steady rhythm rather than speed bursts.",
      "Cool down with light walking.",
    ],
  },
  {
    id: "strength",
    name: "Strength",
    goalMinutes: 25,
    description: "Bodyweight strength and core work.",
    activities: ["Push-ups", "Squats", "Plank"],
    details: [
      { title: "Push-ups", minutes: 8, detail: "3 sets of 6-10 reps." },
      { title: "Squats", minutes: 9, detail: "Slow tempo, keep knees aligned." },
      { title: "Plank", minutes: 8, detail: "3 rounds of 30-45 seconds." },
    ],
    tips: [
      "Focus on form, not speed.",
      "Rest 30-45 seconds between sets.",
      "Engage your core throughout.",
    ],
  },
  {
    id: "flexibility",
    name: "Flexibility",
    goalMinutes: 15,
    description: "Stretching and recovery focused.",
    activities: ["Yoga flow", "Hip mobility", "Back stretch"],
    details: [
      { title: "Yoga flow", minutes: 6, detail: "Slow sun salutations." },
      { title: "Hip mobility", minutes: 5, detail: "Lunges and hip openers." },
      { title: "Back stretch", minutes: 4, detail: "Cat-cow and child pose." },
    ],
    tips: [
      "Breathe deeper with each stretch.",
      "Hold each pose for 20-30 seconds.",
      "Avoid bouncing or forcing range.",
    ],
  },
  {
    id: "balanced",
    name: "Balanced",
    goalMinutes: 25,
    description: "Mix of cardio, strength, and mobility.",
    activities: ["Walk + squats", "Core set", "Stretching"],
    details: [
      { title: "Walk + squats", minutes: 10, detail: "Alternate 2 min walk, 10 squats." },
      { title: "Core set", minutes: 8, detail: "Dead bugs, bird dogs, side plank." },
      { title: "Stretching", minutes: 7, detail: "Full-body stretch to reset." },
    ],
    tips: [
      "Keep transitions quick to stay warm.",
      "Use a timer for each block.",
      "Finish with light breathing.",
    ],
  },
];
