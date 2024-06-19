import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import { AuthenticationGuard } from "../components/auth0/AuthenticationGuard";
import CallbackPage from "../components/auth0/CallbackPage";
import { Login } from "../components/screens/Login/Login";
import UnauthorizedPage from "../components/auth0/UnauthorizedPage";
import { Suspense } from "react";
import { Logout } from "../components/screens/Login/Logout";

// Definición del componente AppRouter
export const AppRouter = () => {
	// Devolución del componente Routes que define las rutas de la aplicación
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<Routes>
				<Route
					path="/*"
					element={<AuthenticationGuard component={ProtectedRoutes} />}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/callback" element={<CallbackPage />} />
				<Route path="/unauthorized" element={<UnauthorizedPage />} />
			</Routes>
		</Suspense>
	);
};
