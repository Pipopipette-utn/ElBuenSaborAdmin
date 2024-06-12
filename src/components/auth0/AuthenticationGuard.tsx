import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CircularProgress, Stack } from "@mui/material";

type Props = {
	component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: Props) => {
	const Component = withAuthenticationRequired(component, {
		onRedirecting: () => (
			<Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
				<CircularProgress />
			</Stack>
		),
	});

	return <Component />;
};
