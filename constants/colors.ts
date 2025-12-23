export type ThemeColors = {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  stats: {
    completed: { background: string; icon: string };
    inProgress: { background: string; icon: string };
    streak: { background: string; icon: string };
  };
  primary: string;
  primaryText: string;
};

export const lightColors: ThemeColors = {
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
};

export const darkColors: ThemeColors = {
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
};
