import { User, UserStats } from "@/types";

export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
};

export const mockUserStats: UserStats = {
  completed: 0,
  inProgress: 2,
  dayStreak: 7,
};
