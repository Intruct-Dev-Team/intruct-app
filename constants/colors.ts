export const lightColors = {
  background: "$gray2",
  cardBackground: "white",
  textPrimary: "$gray12",
  textSecondary: "$gray11",
  textTertiary: "$gray10",

  stats: {
    completed: {
      background: "$green2",
      icon: "$green10",
    },
    inProgress: {
      background: "$purple2",
      icon: "$purple10",
    },
    streak: {
      background: "$orange2",
      icon: "$orange10",
    },
  },

  primary: "$blue9",
  primaryText: "white",
} as const;

export const darkColors = {
  background: "$gray2",
  cardBackground: "$gray3",
  textPrimary: "$gray12",
  textSecondary: "$gray11",
  textTertiary: "$gray10",

  stats: {
    completed: {
      background: "$green3",
      icon: "$green10",
    },
    inProgress: {
      background: "$purple3",
      icon: "$purple10",
    },
    streak: {
      background: "$orange3",
      icon: "$orange10",
    },
  },

  primary: "$blue9",
  primaryText: "white",
} as const;

export type ThemeColors = typeof lightColors;
