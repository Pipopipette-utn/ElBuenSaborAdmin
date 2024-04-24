import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { Login } from "../components/screens/Login/Login";

// Definición del componente AppRouter
export const AppRouter = () => {
	const isLogged = useAppSelector((state) => state.auth.isLogged);

	// Devolución del componente Routes que define las rutas de la aplicación
	return (
		<Routes>
			{isLogged ? (
				<Route path="/*" element={<ProtectedRoutes />} />
			) : (
				<Route path="/*" element={<Navigate to={"/login"} />} />
			)}
			<Route path="/login" element={<Login />} />
		</Routes>
	);
};
