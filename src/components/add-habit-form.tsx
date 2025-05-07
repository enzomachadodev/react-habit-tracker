import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { useState } from "react";
import useHabitStore from "../store/habit";

export const AddHabitForm = () => {
	const [name, setName] = useState("");
	const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

	const { addHabit } = useHabitStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		addHabit({ name, frequency });
		setName("");
	};

	return (
		<form onSubmit={handleSubmit}>
			<Box
				gap={2}
				display="flex"
				flexDirection="column"
			>
				<TextField
					label="Habit Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Exercise"
					fullWidth
					required
				/>
				<FormControl
					fullWidth
					required
				>
					<InputLabel>Frequency</InputLabel>
					<Select
						value={frequency}
						label="Frequency"
						onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
					>
						<MenuItem value="daily">Daily</MenuItem>
						<MenuItem value="weekly">Weekly</MenuItem>
					</Select>
				</FormControl>
				<Button
					type="submit"
					variant="contained"
					color="primary"
				>
					Add Habit
				</Button>
			</Box>
		</form>
	);
};
