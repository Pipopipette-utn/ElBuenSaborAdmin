import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/slices/Auth";
import { Stack } from "@mui/material";

export const Logout = () => {
	const { logout: logoutAuth } = useAuth0();
	const dispatch = useAppDispatch();

	useEffect(() => {
		logoutAuth();
		dispatch(logout());
	}, []);

	return (
		<Stack alignContent="center" justifySelf="center">
			Deslogueando...
		</Stack>
	);
};
