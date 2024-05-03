import { styled } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";

export const Accordion = styled(MuiAccordion)(({ theme }) => ({
	alignItems: "center",
	borderRadius: "10px",
	backgroundColor: theme.palette.bg.light,
	"&::before": {
		content: "none",
	},
}));

