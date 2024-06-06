import { FC, useState } from "react";
import { IEmpresa } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useAppDispatch } from "../../../redux/hooks";
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
import { Tooltip } from "@mui/material";
import { EmpresaForm } from "../forms/EmpresaForm";

interface EmpresaCardProps {
	empresa: IEmpresa;
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

const EmpresaCard: FC<EmpresaCardProps> = ({
	empresa,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

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

	return (
		<>
			<Card onClick={handleClick}>
				<CardHeader title={empresa.nombre} subheader={empresa.razonSocial} />
				<CardMedia
					component="img"
					image={
						empresa.logo && empresa.logo != ""
							? empresa.logo
							: `https://via.placeholder.com/150/FCFCFC/FF4F33?text=${empresa.nombre
									.toUpperCase()
									.charAt(0)}`
					}
				/>
				<CardActions>
					<Tooltip title="Editar">
						<IconButton onClick={handleEditClick}>
							<ModeEditIcon />
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
				<EmpresaForm
					empresa={empresa}
					onClose={handleCloseModal}
					onShowSuccess={onShowSuccess}
					onShowError={onShowError}
				/>
			</GenericModal>
		</>
	);
};

export default EmpresaCard;
