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
	Chip,
	Stack,
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
import {
	setSelectedSucursal,
	setSucursalesEmpresa,
} from "../../../redux/slices/SelectedData";
import { SucursalForm } from "../forms/SucursalForm";
import { AlertDialog } from "../shared/AlertDialog";
import { SucursalService } from "../../../services/SucursalService";
import { useAppSelector } from "../../../redux/hooks";
import { SucursalDetails } from "../details/SucursalDetails";

interface SucursalCardProps {
	sucursal: ISucursal;
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

const SucursalCardDetails: FC<SucursalCardProps> = ({
	sucursal,
	onShowSuccess,
	onShowError,
}) => {
	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursalesEmpresa = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);

	const [showModal, setShowModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const dispatch = useDispatch();
	const onSelectSucursal = () => dispatch(setSelectedSucursal(sucursal));

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleOpenDetailsModal = () => setShowDetailsModal(true);
	const handleCloseDetailsModal = () => setShowDetailsModal(false);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

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
					(s) => s.id != sucursal.id!
				);
				dispatch(setSucursalesEmpresa(newSucursalesEmpresa));
			}
			handleCloseAlert();
			onShowSuccess("Sucursal dada de baja con éxito!");
		} catch (error: any) {
			onShowError("Error al dar de baja sucursal: " + error);
		}
	};

	console.log(sucursal);

	return (
		<>
			<SucursalCard>
				<Stack position="relative">
					<CardMedia
						component="img"
						image={
							sucursal.imagenSucursal && sucursal.imagenSucursal.url
								? sucursal.imagenSucursal.url
								: `https://via.placeholder.com/150/FCFCFC/FF4F33?text=${sucursal.nombre.charAt(
										0
								  )}`
						}
						sx={{ height: "140px" }}
					/>

					{sucursal.esCasaMatriz && (
						<Chip
							size="small"
							color="primary"
							label="Casa matriz"
							sx={{
								position: "absolute", // Añade 'position: absolute'
								bottom: 0, // Añade 'bottom: 0' para posicionar el Chip en la parte inferior
								right: 0, // Añade 'left: 0' para posicionar el Chip en la izquierda
								m: 1, // Añade margen
							}}
						/>
					)}
				</Stack>
				<SucursalCardHeader title={sucursal.nombre} />
				<CardContent sx={{ pb: 0, height: "80px" }}>
					<Typography>
						{sucursal.horarioApertura}-{sucursal.horarioCierre}
					</Typography>
					<Typography fontSize="14px">
						{sucursal.domicilio?.calle} {sucursal.domicilio?.numero},{" "}
						{sucursal.domicilio?.localidad?.nombre}
					</Typography>
				</CardContent>
				<CardActions disableSpacing>
					<Tooltip title="Seleccionar categoría">
						<SucursalIconButton onClick={onSelectSucursal}>
							<AdsClickIcon />
						</SucursalIconButton>
					</Tooltip>
					<Tooltip title="Ver detalles">
						<SucursalIconButton onClick={handleOpenDetailsModal}>
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
			<SucursalDetails
				sucursal={sucursal}
				open={showDetailsModal}
				handleClose={handleCloseDetailsModal}
			/>
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
