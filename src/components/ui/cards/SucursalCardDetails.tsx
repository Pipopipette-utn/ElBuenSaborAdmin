import { FC, useState } from "react";
import { ISucursal } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import StoreIcon from "@mui/icons-material/Store";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdsClickIcon from "@mui/icons-material/AdsClick";

import {
	CardActions,
	CardContent,
	CardMedia,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	SucursalCard,
	SucursalCardHeader,
	SucursalIconButton,
} from "../styled/StyledSucursalCard";
import GenericModal from "../shared/GenericModal";
import { useDispatch } from "react-redux";
import { setSucursal, setSucursalesEmpresa } from "../../../redux/slices/SelectedData";
import { SucursalForm } from "../forms/SucursalForm";
import { AlertDialog } from "../shared/DialogAlert";
import { SucursalService } from "../../../services/SucursalService";
import { setSucursales } from "../../../redux/slices/Business";
import { useAppSelector } from "../../../redux/hooks";

interface SucursalCardProps {
	sucursal: ISucursal;
}

const SucursalCardDetails: FC<SucursalCardProps> = ({ sucursal }) => {
	const sucursales = useAppSelector((state) => state.business.sucursales);
	const sucursalesEmpresa = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);
	
	const [showModal, setShowModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const dispatch = useDispatch();
	const onSelectSucursal = () => dispatch(setSucursal(sucursal));

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleDeleteClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.stopPropagation(); // Detiene la propagación del evento
		handleOpenAlert();
	};

	const handleDelete = async () => {
		const sucursalService = new SucursalService("/sucursales");
		await sucursalService.delete(sucursal.id!);
		const newSucursales = sucursales!.filter((s) => s.id != sucursal.id!);
		dispatch(setSucursales(newSucursales));
		const newSucursalesEmpresa = sucursalesEmpresa!.filter(
			(s) => s.id != sucursal.id!
		);
		dispatch(setSucursalesEmpresa(newSucursalesEmpresa));
		handleCloseAlert();
	};

	return (
		<>
			<SucursalCard>
				<CardMedia
					component="img"
					image={sucursal.icon}
					sx={{ height: "140px" }}
				/>
				<SucursalCardHeader title={sucursal.nombre} />
				<CardContent sx={{ pb: 0 }}>
					<Typography>
						{sucursal.horarioApertura}-{sucursal.horarioCierre}
					</Typography>
					<Typography>
						{sucursal.domicilio?.calle} {sucursal.domicilio?.numero},{" "}
						{sucursal.domicilio?.localidad}
					</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Tooltip title="Seleccionar categoría">
						<SucursalIconButton onClick={onSelectSucursal}>
							<AdsClickIcon />
						</SucursalIconButton>
					</Tooltip>
					<Tooltip title="Ver detalles">
						<SucursalIconButton onClick={handleOpenModal}>
							<VisibilityIcon />
						</SucursalIconButton>
					</Tooltip>
					<Tooltip title="Editar">
						<SucursalIconButton onClick={handleOpenModal}>
							<ModeEditIcon />
						</SucursalIconButton>
					</Tooltip>
					<Tooltip title="Eliminar">
						<SucursalIconButton onClick={handleDeleteClick}>
							<DeleteIcon />
						</SucursalIconButton>
					</Tooltip>
				</CardActions>
			</SucursalCard>
			<GenericModal
				title={"Editar sucursal"}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<SucursalForm sucursal={sucursal} onClose={handleCloseModal} />
			</GenericModal>
			<AlertDialog
				open={showAlert}
				title={"¿Estás seguro de que querés eliminar la sucursal?"}
				content={"Esta acción no es reversible"}
				onAgreeClose={handleDelete}
				onDisagreeClose={handleCloseAlert}
			/>
		</>
	);
};

export default SucursalCardDetails;
