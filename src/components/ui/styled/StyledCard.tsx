import { styled } from "@mui/material";
import MuiCard from "@mui/material/Card";
import MuiCardMedia from "@mui/material/CardMedia";
import MuiCardHeader from "@mui/material/CardHeader";
import MuiIconButton from "@mui/material/IconButton";
import MuiCardActions from "@mui/material/CardActions";

export const Card = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: 224,
	height: 320,
	alignItems: "center",
	backgroundColor: theme.palette.bg.main,
	margin: "0px 18px 30px 18px",
	justifyContent: "center",
	"&:hover": {
		backgroundColor: theme.palette.bg.dark,
		cursor: "pointer",
	},
}));

export const CardHeader = styled(MuiCardHeader)(() => ({
	textAlign: "center",
	"& .MuiCardHeader-title": {
		fontWeight: "400",
		fontSize: 20,
	},
}));

export const CardMedia = styled(MuiCardMedia)<{ component: string }>(() => ({
	display: "flex",
	justifyContent: "center",
	borderRadius: "10px",
	margin: "auto",
	width: "60%", 
	height: "42%", 
	maxHeight: "42%", 
}));

export const CardActions = styled(MuiCardActions)(() => ({
	justifyContent: "center",
	height: "auto",
}));

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
	marginTop: "12px",
	color: theme.palette.info.light,
	"&:hover": {
		backgroundColor: theme.palette.info.light,
		color: theme.palette.bg.dark,
	},
}));

export const AddCard = styled(MuiCard)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: 224,
	height: 320,
	backgroundColor: theme.palette.bg.main,
	justifyContent: "center",
	margin: "0px 18px 30px 18px",
	border: `2px dashed ${theme.palette.info.light}`,
	boxShadow: "0px 0px 0px transparent",
	"&:hover": {
		backgroundColor: theme.palette.bg.dark,
		cursor: "pointer",
		"& .MuiCardActions-root .MuiIconButton-root": {
			backgroundColor: theme.palette.info.light,
			color: theme.palette.bg.main,
		},
	},
}));

export const AddCardActions = styled(MuiCardActions)(() => ({
	flexGrow: 1,
	alignItems: "flex-start",
	marginTop: "16px",
	justifyContent: "center",
}));

export const AddIconButton = styled(MuiIconButton)(({ theme }) => ({
	color: theme.palette.info.light,
	backgroundColor: theme.palette.bg.dark,
	borderRadius: "10px",
	width: "130px",
	height: "130px",
}));