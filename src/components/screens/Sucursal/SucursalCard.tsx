import { FC } from "react";
import { ISucursal } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import {setSucursal } from "../../../redux/slices/Business";
import { Card, CardActions, CardHeader, CardMedia, IconButton } from "../../ui/styled/StyledCard";

interface SucursalCardProps {
	sucursal: ISucursal;
}

const SucursalCard: FC<SucursalCardProps> = ({ sucursal }) => {
	const navigate = useNavigate();
	// Obtención del despachador de acciones de Redux
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setSucursal(sucursal));
		navigate("/inicio");
	};

	return (
		<Card onClick={handleClick}>
			<CardHeader
				title={sucursal.nombre}
				subheader={`${sucursal.horarioApertura}-${sucursal.horarioCierre}`}
			/>
			<CardMedia component="img" image={sucursal.icon} />
			<CardActions>
				<IconButton>
					<ModeEditIcon />
				</IconButton>
				<IconButton>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default SucursalCard;
