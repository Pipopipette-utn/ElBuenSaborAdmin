import { styled } from "@mui/material";
import MuiCard from "@mui/material/Card";

export const Card = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	width: "100%",
	height: "120px",
	padding: "24px",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	border: `1px solid ${theme.palette.bg.main}`,
	borderRadius: "10px",
	backgroundColor: theme.palette.bg.main,
	boxShadow: '4px 4px 10px rgba(0, 0, 0, .4)',
}));
