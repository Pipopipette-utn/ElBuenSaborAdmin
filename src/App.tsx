import { Box } from "@mui/material";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";
import { AppMenu } from "./components/ui/Menu/AppMenu";

export const App = () => {
	return (
		<Box sx={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "row" }}>
			<Box sx={{ width: 240 }}>
				<AppMenu />
			</Box>
			<Box sx={{ width: "100%"}}>
				<AppRouter />
			</Box>
		</Box>
	);
};

export default App;
