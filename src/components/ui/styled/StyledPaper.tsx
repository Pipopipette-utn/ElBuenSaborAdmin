import { Paper, styled } from "@mui/material";

export const HorizontalPaper = styled(Paper)(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "10px 16px",
	margin: theme.spacing(2),
}));
