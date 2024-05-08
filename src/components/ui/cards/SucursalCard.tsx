import { FC, useState } from "react";
import { ISucursal } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
	Card,
	CardActions,
	CardHeader,
	CardMedia,
	IconButton,
} from "../../ui/styled/StyledCard";
import { setSucursal, setSucursalesEmpresa } from "../../../redux/slices/SelectedData";
import StoreIcon from "@mui/icons-material/Store";
import GenericModal from "../shared/GenericModal";
import { Tooltip } from "@mui/material";
import { SucursalForm } from "../forms/SucursalForm";
import { SucursalService } from "../../../services/SucursalService";
import { setSucursales } from "../../../redux/slices/Business";
import { AlertDialog } from "../shared/DialogAlert";

interface SucursalCardProps {
	sucursal: ISucursal;
}

const SucursalCard: FC<SucursalCardProps> = ({ sucursal }) => {
	const sucursales = useAppSelector((state) => state.business.sucursales);
	const sucursalesEmpresa = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);

	const navigate = useNavigate();
	// Obtención del despachador de acciones de Redux
	const dispatch = useAppDispatch();

	const [showModal, setShowModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleEditClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.stopPropagation(); // Detiene la propagación del evento
		handleOpenModal();
	};

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

	const handleClick = () => {
		dispatch(setSucursal(sucursal));
		navigate("/inicio");
	};

	return (
		<>
			<Card onClick={handleClick}>
				<CardHeader
					title={sucursal.nombre}
					subheader={`${sucursal.domicilio?.calle} ${sucursal.domicilio?.numero}, ${sucursal.domicilio?.localidad}`}
				/>
				<CardMedia component="img" image={sucursal.icon} />
				<CardActions>
					<Tooltip title="Editar">
						<IconButton onClick={handleEditClick}>
							<ModeEditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Eliminar">
						<IconButton onClick={handleDeleteClick}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</CardActions>
			</Card>
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

export default SucursalCard;
