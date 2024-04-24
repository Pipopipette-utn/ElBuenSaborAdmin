import { Box } from "@mui/material";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";

export const App = () => {
	return (
		<Box
			sx={{
				width: "100vw",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<AppRouter />
		</Box>
	);
};

export default App;
