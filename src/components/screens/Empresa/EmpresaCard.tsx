import { FC } from "react";
import { IEmpresa } from "../../../types/empresa";
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	Typography,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { theme } from "../../../styles/theme";

interface EmpresaCardProps {
	empresa: IEmpresa;
}

const EmpresaCard: FC<EmpresaCardProps> = ({ empresa }) => {
	return (
		<Card
			sx={{
				width: 250,
				backgroundColor: theme.palette.bg.main,
				mx: "16px",
				mb: "30px",
			}}
		>
			<CardHeader title={empresa.nombre} subheader="Subtitulo" />
			<CardMedia
				component="img"
				height="194"
				image="https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
				alt="Paella dish"
			/>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					{empresa.icon}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label="add to favorites">
					<ModeEditIcon />
				</IconButton>
				<IconButton aria-label="share">
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default EmpresaCard;
