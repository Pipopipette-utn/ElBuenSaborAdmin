import { Stack, Typography } from "@mui/material";

const UnauthorizedPage = () => {
	return (
		<Stack width="100vw" height="100vh" alignItems="center">
			<Typography variant="h5" sx={{ mt: 4 }}>
				Ups, ¡no tienes permisos!
			</Typography>
			<img
				style={{
					objectFit: "contain",
					maxHeight: "80vh",
					width: "auto",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
				src={
					"https://static.vecteezy.com/system/resources/previews/004/112/254/non_2x/login-access-denied-illustration-system-refuses-password-error-and-entry-to-computer-device-showing-user-does-not-have-permission-for-website-or-mobile-development-vector.jpg"
				}
			></img>
		</Stack>
	);
};

export default UnauthorizedPage;
