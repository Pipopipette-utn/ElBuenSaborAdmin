import { FC } from "react";
import { ISucursal } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";

import { CardActions, CardContent, CardMedia } from "@mui/material";
import {
	SucursalCard,
	SucursalCardHeader,
	SucursalIconButton,
} from "../styled/StyledSucursalCard";
import { setSucursal } from "../../../redux/slices/SelectedData";

interface SucursalCardProps {
	sucursal: ISucursal;
}

const SucursalCardDetails: FC<SucursalCardProps> = ({ sucursal }) => {
	const navigate = useNavigate();
	// Obtención del despachador de acciones de Redux
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setSucursal(sucursal));
		navigate("/inicio");
	};

	return (
		<SucursalCard onClick={handleClick}>
			<CardMedia component="img" image={sucursal.icon} sx={{maxHeight: "160px"}} />
			<SucursalCardHeader title={sucursal.nombre} />
			<CardContent>{sucursal.horarioApertura}</CardContent>
			<CardActions>
				<SucursalIconButton>
					<ModeEditIcon />
				</SucursalIconButton>
				<SucursalIconButton>
					<DeleteIcon />
				</SucursalIconButton>
			</CardActions>
		</SucursalCard>
	);
};

export default SucursalCardDetails;
