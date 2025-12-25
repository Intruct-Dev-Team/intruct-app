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

export const lightColors: ThemeColors = (() => {
  const completed: any = {};
  completed.background = "$green2";
  completed.icon = "$green10";

  const inProgress: any = {};
  inProgress.background = "$purple2";
  inProgress.icon = "$purple10";

  const streak: any = {};
  streak.background = "$orange2";
  streak.icon = "$orange10";

  const stats: any = {};
  stats.completed = completed;
  stats.inProgress = inProgress;
  stats.streak = streak;

  const colors: any = {};
  colors.background = "$gray2";
  colors.cardBackground = "white";
  colors.textPrimary = "$gray12";
  colors.textSecondary = "$gray11";
  colors.textTertiary = "$gray10";
  colors.stats = stats;
  colors.primary = "$blue9";
  colors.primaryText = "white";

  return colors as ThemeColors;
})();

export const darkColors: ThemeColors = (() => {
  const completed: any = {};
  completed.background = "$green3";
  completed.icon = "$green10";

  const inProgress: any = {};
  inProgress.background = "$purple3";
  inProgress.icon = "$purple10";

  const streak: any = {};
  streak.background = "$orange3";
  streak.icon = "$orange10";

  const stats: any = {};
  stats.completed = completed;
  stats.inProgress = inProgress;
  stats.streak = streak;

  const colors: any = {};
  colors.background = "$gray2";
  colors.cardBackground = "$gray3";
  colors.textPrimary = "$gray12";
  colors.textSecondary = "$gray11";
  colors.textTertiary = "$gray10";
  colors.stats = stats;
  colors.primary = "$blue9";
  colors.primaryText = "white";

  return colors as ThemeColors;
})();
