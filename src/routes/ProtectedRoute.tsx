import { FC } from "react";
import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router";

interface PrivateRouteProps {
	component: React.ComponentType;
	roles?: string[];
}

const PrivateRoute: FC<PrivateRouteProps> = ({
	component: Component,
	roles,
}) => {
	const user = useAppSelector((state) => state.auth.user);
	const login = useAppSelector((state) => state.auth.login);
	
	if (!login) {
		return null;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (roles && !roles.includes(user!.rol!)) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <Component />;
};

export default PrivateRoute;
