import { Box, Typography } from "@mui/material";
import useHabitStore from "../store/habit";

export const HabitStatistics = () => {
	const { habits } = useHabitStore();

	const getStatistics = () => {
		return {
			totalHabits: habits.length,
			completedToday: habits.filter((habit) =>
				habit.completedDates.includes(new Date().toISOString().split("T")[0])
			).length,
			longestStreak: Math.max(...habits.map((habit) => habit.currentStreak)),
		};
	};

	const { totalHabits, completedToday, longestStreak } = getStatistics();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				mt: 4,
				border: "1px solid #ccc",
				padding: 2,
				borderRadius: 2,
			}}
		>
			<Typography
				variant="h5"
				gutterBottom
			>
				Habit Statistics
			</Typography>
			<Typography>Total Habits: {totalHabits}</Typography>
			<Typography>Completed Today: {completedToday}</Typography>
			<Typography>Longest Streak: {longestStreak}</Typography>
		</Box>
	);
};
