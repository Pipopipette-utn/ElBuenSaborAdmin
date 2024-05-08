import { FC, useState } from "react";
import { IEmpresa } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
	Card,
	CardActions,
	CardHeader,
	CardMedia,
	IconButton,
} from "../../ui/styled/StyledCard";
import { useNavigate } from "react-router-dom";
import { setEmpresa } from "../../../redux/slices/SelectedData";
import GenericModal from "../shared/GenericModal";
import StoreIcon from "@mui/icons-material/Store";
import { EmpresaForm } from "../forms/EmpresaForm";
import { Tooltip } from "@mui/material";
import { AlertDialog } from "../shared/DialogAlert";
import { EmpresaService } from "../../../services/EmpresaService";
import { setEmpresas } from "../../../redux/slices/Business";

interface EmpresaCardProps {
	empresa: IEmpresa;
}

const EmpresaCard: FC<EmpresaCardProps> = ({ empresa }) => {
	// Obtención del despachador de acciones de Redux
	const empresas = useAppSelector((state) => state.business.empresas);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleClick = () => {
		dispatch(setEmpresa(empresa));
		navigate("/empresas/sucursales");
	};

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
		const empresaService = new EmpresaService("/empresas");
		await empresaService.delete(empresa.id!);
		const newEmpresas = empresas!.filter((e) => e.id != empresa.id!);
		dispatch(setEmpresas(newEmpresas));
		handleCloseAlert();
	};

	return (
		<>
			<Card onClick={handleClick}>
				<CardHeader title={empresa.nombre} subheader={empresa.razonSocial} />
				<CardMedia component="img" image={empresa.icon} />
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
				title={"Editar empresa"}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<EmpresaForm empresa={empresa} onClose={handleCloseModal} />
			</GenericModal>
			<AlertDialog
				open={showAlert}
				title={"¿Estás seguro de que querés eliminar la empresa?"}
				content={"Esta acción no es reversible"}
				onAgreeClose={handleDelete}
				onDisagreeClose={handleCloseAlert}
			/>
		</>
	);
};

export default EmpresaCard;
