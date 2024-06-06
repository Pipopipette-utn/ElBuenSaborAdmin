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
import {
	setSelectedSucursal,
	setSucursalesEmpresa,
} from "../../../redux/slices/SelectedData";
import StoreIcon from "@mui/icons-material/Store";
import GenericModal from "../shared/GenericModal";
import { Chip, Tooltip } from "@mui/material";
import { SucursalForm } from "../forms/SucursalForm";
import { SucursalService } from "../../../services/SucursalService";
import { AlertDialog } from "../shared/AlertDialog";

interface SucursalCardProps {
	sucursal: ISucursal;
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

const SucursalCard: FC<SucursalCardProps> = ({
	sucursal,
	onShowSuccess,
	onShowError,
}) => {
	const empresa = useAppSelector((state) => state.selectedData.empresa);
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
		try {
			const sucursalService = new SucursalService("/sucursales");
			await sucursalService.delete(sucursal.id!);
			if (Array.isArray(sucursalesEmpresa)) {
				const newSucursalesEmpresa = sucursalesEmpresa!.filter(
					(s: ISucursal) => s.id != sucursal.id!
				);
				dispatch(setSucursalesEmpresa(newSucursalesEmpresa));
			}
			handleCloseAlert();
			onShowSuccess("Sucursal dada de baja con éxito!");
		} catch (error: any) {
			onShowError("Error al dar de baja sucursal: " + error);
		}
	};

	const handleClick = () => {
		dispatch(setSelectedSucursal(sucursal));
		navigate("/inicio");
	};

	return (
		<>
			<Card onClick={handleClick}>
				<CardHeader
					title={sucursal.nombre}
					subheader={`${sucursal.domicilio?.calle} 
						${sucursal.domicilio?.numero}, 
						${sucursal.domicilio?.localidad?.nombre}`}
				/>
				<CardMedia
					component="img"
					image={
						sucursal.logo && sucursal.logo != ""
							? sucursal.logo
							: `https://via.placeholder.com/150/FCFCFC/FF4F33?text=${sucursal.nombre.charAt(
									0
							  )}`
					}
				/>
				{sucursal.esCasaMatriz && (
					<Chip
						color="primary"
						label="Casa matriz"
						size="small"
						sx={{ mt: 1 }}
					/>
				)}
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
				title={`Editar sucursal de ${empresa!.nombre}`}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<SucursalForm
					initialSucursal={sucursal}
					onClose={handleCloseModal}
					onShowSuccess={onShowSuccess}
					onShowError={onShowError}
				/>
			</GenericModal>
			<AlertDialog
				open={showAlert}
				title={"¿Estás seguro de que querés eliminar la sucursal?"}
				content={"Esta acción no es reversible."}
				onAgreeClose={handleDelete}
				onDisagreeClose={handleCloseAlert}
			/>
		</>
	);
};

export default SucursalCard;
