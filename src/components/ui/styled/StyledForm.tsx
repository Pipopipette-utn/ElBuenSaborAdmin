import { styled } from "@mui/material";
import MuiStack from "@mui/material/Stack"
import MuiTypography from "@mui/material/Typography"

export const TextFieldStack = styled(MuiStack)(({ theme }) => ({
	alignItems: "flex-start",
	width: "100%",
}));

export const ErrorTypography = styled(MuiTypography)(({ theme }) => ({
	fontWeight: 400,
	color: "red"
}));