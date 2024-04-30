import { Route, Routes } from "react-router-dom";
import { Home } from "../components/screens/Home/Home";
import { AppMenu } from "../components/ui/Menu/AppMenu";
import { Box } from "@mui/material";
import { Empresas } from "../components/screens/Empresa/Empresas";
export const ProtectedRoutes = () => {
	return (
		<>
			<AppMenu />
			<Box
				className="ContentContainer"
				height="100%"
				alignItems="center"
				sx={{ flexGrow: 1, m: 6, mt: 12 }}
			>
				<Routes>
					<Route path="/" element={<Empresas />} />
					<Route path="/empresas" element={<Empresas />} />
					<Route path="/empresas/sucursales" element={<Home />} />
				</Routes>
			</Box>
		</>
	);
};
