import useHabitStore from "../store/habit";
import {
	Box,
	Button,
	Grid,
	LinearProgress,
	Paper,
	Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

export const HabitList = () => {
	const { habits, removeHabit, toggleHabit } = useHabitStore();

	const today = new Date().toISOString().split("T")[0];

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap={2}
			mt={4}
		>
			{habits.map((habit) => (
				<Paper
					key={habit.id}
					elevation={3}
				>
					<Grid
						container
						alignItems="center"
						justifyContent="space-between"
						spacing={2}
						padding={2}
					>
						<Grid
							alignItems="center"
							size={{ xs: 12, sm: 6 }}
						>
							<Typography
								variant="h6"
								component="h3"
							>
								{habit.name}
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
							>
								Frequency: {habit.frequency}
							</Typography>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<Box
								display="flex"
								justifyContent="flex-end"
								gap={1}
							>
								<Button
									onClick={() => toggleHabit({ id: habit.id, date: today })}
									variant="outlined"
									color={
										habit.completedDates.includes(today) ? "success" : "primary"
									}
									startIcon={<CheckCircleIcon />}
								>
									{habit.completedDates.includes(today)
										? "Completed"
										: "Mark Completed"}
								</Button>
								<Button
									onClick={() => removeHabit(habit.id)}
									variant="outlined"
									color="error"
									startIcon={<DeleteIcon />}
								>
									Remove
								</Button>
							</Box>
						</Grid>
					</Grid>
					<Box
						mt={2}
						padding={2}
						display="flex"
						flexDirection="column"
						gap={1}
					>
						<Typography>Current Streak: {habit.currentStreak} / 30</Typography>
						<LinearProgress
							variant="determinate"
							value={(habit.currentStreak / 30) * 100}
						/>
					</Box>
				</Paper>
			))}
		</Box>
	);
};
