import { Route, Routes } from "react-router-dom";
import { Home } from "../components/screens/Home/Home";
import { AppMenu } from "../components/ui/Menu/AppMenu";
import { Box } from "@mui/material";
export const ProtectedRoutes = () => {
	return (
		<>
			<AppMenu />
			<Box sx={{width:"100%", height:"100%", mt: {mobile: "52px", sm: "64px"}}}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/inicio" element={<Home />} />
				</Routes>
			</Box>
		</>
	);
};
