import { styled } from "@mui/material";
import MuiStack from "@mui/material/Stack"

export const ContainerStack = styled(MuiStack)(() => ({
    margin: "16px 32px",
}));

export const StyledStack = styled(MuiStack)(({theme}) => ({
	backgroundColor: theme.palette.bg.dark,
    borderRadius: "20px",
    padding: 24,
}));