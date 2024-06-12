import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export const Login = () => {
	const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		if (!isLoading && !isAuthenticated && !isRedirecting) {
			setIsRedirecting(true);
			loginWithRedirect({
				authorizationParams: {
					screen_hint: "login",
				},
			});
		}
	}, [isLoading, isAuthenticated, isRedirecting, loginWithRedirect]);

	return (
		<>Redirigiendo al login...</>
	);
};
