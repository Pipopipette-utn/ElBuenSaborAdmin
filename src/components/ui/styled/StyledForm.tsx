import { styled } from "@mui/material";
import MuiStack from "@mui/material/Stack"
import MuiTypography from "@mui/material/Typography"

export const TextFieldStack = styled(MuiStack)(() => ({
	alignItems: "flex-start",
	width: "100%",
}));

export const ErrorTypography = styled(MuiTypography)(() => ({
	fontWeight: 400,
	color: "red"
}));