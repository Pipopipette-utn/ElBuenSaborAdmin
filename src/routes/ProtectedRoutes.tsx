import { Route, Routes } from "react-router-dom";
import { Home } from "../components/screens/Home/Home";
import { AppMenu } from "../components/ui/Menu/AppMenu";
import { Box } from "@mui/material";
import { Empresas } from "../components/screens/Empresa/Empresas";
export const ProtectedRoutes = () => {
	return (
		<>
			<AppMenu />
			<Box width="100%" height="100%" sx={{ mt: {mobile: "52px", sm: "64px"}}}>
				<Routes>
					<Route path="/" element={<Empresas />} />
					<Route path="/inicio" element={<Home />} />
				</Routes>
			</Box>
		</>
	);
};
