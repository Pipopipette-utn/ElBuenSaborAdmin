import { FC, useState } from "react";
import { ISucursal } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import StoreIcon from "@mui/icons-material/Store";

import { CardActions, CardContent, CardMedia } from "@mui/material";
import {
	SucursalCard,
	SucursalCardHeader,
	SucursalIconButton,
} from "../styled/StyledSucursalCard";
import GenericModal from "../shared/GenericModal";

interface SucursalCardProps {
	sucursal: ISucursal;
}

const SucursalCardDetails: FC<SucursalCardProps> = ({ sucursal }) => {
	const [showModal, setShowModal] = useState(false);

	const onOpenModal = () => setShowModal(true);
	const onCloseModal = () => setShowModal(false);
	return (
		<>
			<SucursalCard>
				<CardMedia
					component="img"
					image={sucursal.icon}
					sx={{ maxHeight: "160px" }}
				/>
				<SucursalCardHeader title={sucursal.nombre} />
				<CardContent>{sucursal.horarioApertura}</CardContent>
				<CardActions>
					<SucursalIconButton onClick={onOpenModal}>
						<ModeEditIcon />
					</SucursalIconButton>
					<SucursalIconButton>
						<DeleteIcon />
					</SucursalIconButton>
				</CardActions>
			</SucursalCard>
			<GenericModal
				title={"Editar sucursal"}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={onCloseModal}
			>
				<>Formulario sucursal</>
			</GenericModal>
		</>
	);
};

export default SucursalCardDetails;
