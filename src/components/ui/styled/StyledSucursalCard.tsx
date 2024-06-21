import { styled } from "@mui/material";
import MuiCard from "@mui/material/Card";
import MuiCardHeader from "@mui/material/CardHeader";
import MuiIconButton from "@mui/material/IconButton";

export const SucursalCard = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	borderRadius: "20px",
	width: 212,
	backgroundColor: theme.palette.bg.main,
	margin: "0px 18px 30px 18px",
	justifyContent: "space-between",
	"&:hover": {
		backgroundColor: theme.palette.bg.dark,
		cursor: "pointer",
	},
}));

export const SucursalCardHeader = styled(MuiCardHeader)(() => ({
	paddingBottom: 0,
	"& .MuiCardHeader-title": {
		fontWeight: "bold",
		fontSize: 16,
	},
}));


export const SucursalIconButton = styled(MuiIconButton)(({ theme }) => ({
	color: theme.palette.info.light,
	marginRight: -3,
	"&:hover": {
		backgroundColor: theme.palette.info.light,
		color: theme.palette.bg.dark,
	},
}));
