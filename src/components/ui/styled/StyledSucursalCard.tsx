import { styled } from "@mui/material";
import MuiCard from "@mui/material/Card";
import MuiCardMedia from "@mui/material/CardMedia";
import MuiCardHeader from "@mui/material/CardHeader";
import MuiIconButton from "@mui/material/IconButton";
import MuiCardActions from "@mui/material/CardActions";

export const SucursalCard = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	borderRadius: "20px",
	width: 212,
	backgroundColor: theme.palette.bg.main,
	margin: "0px 18px 30px 18px",
	"&:hover": {
		backgroundColor: theme.palette.bg.dark,
		cursor: "pointer",
	},
}));

export const SucursalCardHeader = styled(MuiCardHeader)(() => ({
	"& .MuiCardHeader-title": {
		fontWeight: "bold",
		fontSize: 18,
	},
}));


export const SucursalIconButton = styled(MuiIconButton)(({ theme }) => ({
	color: theme.palette.info.light,
	"&:hover": {
		backgroundColor: theme.palette.info.light,
		color: theme.palette.bg.dark,
	},
}));
