import { FC, useState } from "react";
import { IEmpresa } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
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

interface EmpresaCardProps {
	empresa: IEmpresa;
}

const EmpresaCard: FC<EmpresaCardProps> = ({ empresa }) => {
	// Obtención del despachador de acciones de Redux
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const onOpenModal = () => setShowModal(true);
	const onCloseModal = () => setShowModal(false);

	const handleClick = () => {
		dispatch(setEmpresa(empresa));
		navigate("/empresas/sucursales");
	};

	const handleEditClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.stopPropagation(); // Detiene la propagación del evento
		onOpenModal();
	};

	return (
		<>
			<Card onClick={handleClick}>
				<CardHeader title={empresa.nombre} subheader={empresa.razonSocial} />
				<CardMedia component="img" image={empresa.icon} />
				<CardActions>
					<IconButton onClick={handleEditClick}>
						<ModeEditIcon />
					</IconButton>
					<IconButton>
						<DeleteIcon />
					</IconButton>
				</CardActions>
			</Card>
			<GenericModal
				title={"Editar empresa"}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={onCloseModal}
			>
				<>Formulario sucursal</>
			</GenericModal>
		</>
	);
};

export default EmpresaCard;
