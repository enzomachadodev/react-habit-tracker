import "./App.css";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
import { AddHabitForm } from "./components/add-habit-form";
import { HabitList } from "./components/habit-list";
import useHabitStore from "./store/habit";
import { useEffect } from "react";
import { HabitStatistics } from "./components/habit-statistics";

function App() {
	const { fetchHabits, isLoading, error } = useHabitStore();

	useEffect(() => {
		const fetchData = async () => {
			await fetchHabits();
		};
		fetchData();
	}, [fetchHabits]);

	return (
		<Container>
			<Box>
				<Typography
					variant="h2"
					component="h1"
					gutterBottom
					align="center"
				>
					Habit Tracker
				</Typography>
				<AddHabitForm />
				{isLoading && <LinearProgress />}
				{error && (
					<Typography
						variant="body1"
						color="error"
						align="center"
						sx={{ mt: 2 }}
					>
						{error}
					</Typography>
				)}
				{!isLoading && !error && (
					<>
						<HabitList />
						<HabitStatistics />
					</>
				)}
			</Box>
		</Container>
	);
}

export default App;
