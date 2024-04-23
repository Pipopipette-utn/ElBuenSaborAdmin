import { Route, Routes } from "react-router-dom";
import { Home } from "../components/screens/Home/Home";

// Definición del componente AppRouter
export const AppRouter = () => {
	// Devolución del componente Routes que define las rutas de la aplicación
	return (
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	);
};
