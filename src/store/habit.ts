import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Frequency = "daily" | "weekly";

export interface Habit {
	id: string;
	name: string;
	frequency: Frequency;
	completedDates: string[];
	currentStreak: number;
	createdAt: string;
}

export interface CreateHabit {
	name: string;
	frequency: Frequency;
}

export interface ToggleHabit {
	id: string;
	date: string;
}

interface HabitState {
	habits: Habit[];
	isLoading: boolean;
	error: string | null;
	addHabit: (data: CreateHabit) => void;
	removeHabit: (id: string) => void;
	toggleHabit: (data: ToggleHabit) => void;
	fetchHabits: () => Promise<void>;
}

const calculateStreak = (completedDates: string[], frequency: Frequency): number => {
  if (completedDates.length === 0) return 0;

  const sortedDates = [...completedDates].sort().reverse(); 
  let streak = 0;
  const today = new Date().toISOString().split("T")[0]; //desc

  if (frequency === "daily") {
    const currentDate = new Date(today);
    for (const date of sortedDates) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      if (formattedDate === currentDate.toISOString().split("T")[0]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else if (frequency === "weekly") {
    const getWeekNumber = (date: Date): number => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
      const week1 = new Date(d.getFullYear(), 0, 4);
      return Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7) + 1;
    };

    const todayWeek = getWeekNumber(new Date());
    const weeks = new Set(sortedDates.map((date) => getWeekNumber(new Date(date))));
    let currentWeek = todayWeek;
    while (weeks.has(currentWeek)) {
      streak++;
      currentWeek--;
    }
  }

  return streak;
};

const useHabitStore = create<HabitState>()(
	persist(
		(set, get) => ({
			habits: [],
			isLoading: false,
			error: null,
			addHabit: (data: CreateHabit) =>
				set((state) => {
					return {
						habits: [
							...state.habits,
							{
								...data,
								id: crypto.randomUUID(),
								currentStreak: 0,
								completedDates: [],
								createdAt: new Date().toISOString(),
							},
						],
					};
				}),
			removeHabit: (id: string) =>
				set((state) => ({
					habits: state.habits.filter((habit) => habit.id !== id),
				})),
			toggleHabit: ({ id, date }: ToggleHabit) => {
				set((state) => ({
					habits: state.habits.map((habit) =>
						habit.id === id
							? {
									...habit,
									completedDates: habit.completedDates.includes(date)
										? habit.completedDates.filter((d) => d !== date)
										: [...habit.completedDates, date],
									currentStreak: habit.completedDates.includes(date)
										? habit.currentStreak - 1
										: habit.currentStreak + 1,
							  }
							: habit
					),
				}));
			},
			fetchHabits: async () => {
				set({ isLoading: true, error: null });

				try {
					const currentHabits = get().habits;

					if (currentHabits.length > 0) {
						currentHabits.forEach((habit) => {
							const currentDate = new Date();

							while (true) {
								const dateString = currentDate.toISOString().split("T")[0];

								if (habit.completedDates.includes(dateString)) {
									set((state) => ({
										habits: state.habits.map((h) =>
											h.id === habit.id
												? {
														...h,
														currentStreak: h.currentStreak + 1,
												  }
												: h
										),
									}));

									currentDate.setDate(currentDate.getDate() - 1);
								} else {
									break;
								}
							}
						});

						set({ habits: currentHabits, isLoading: false, error: null });
						return;
					}

					await new Promise((resolve) => setTimeout(resolve, 2000));

					const mockData: Habit[] = [
						{
							id: crypto.randomUUID(),
							frequency: "daily",
							completedDates: [],
							currentStreak: 0,
							createdAt: new Date().toISOString(),
							name: "Exercise",
						},
						{
							id: crypto.randomUUID(),
							frequency: "weekly",
							completedDates: [],
							currentStreak: 0,
							createdAt: new Date().toISOString(),
							name: "Read a book",
						},
					];

					set({ habits: mockData, isLoading: false });
				} catch (error) {
					console.error(error);
					set({ isLoading: false, error: "Failed to fetch habits" });
				}
			},
		}),
		{
			name: "habit-tracker",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useHabitStore;
