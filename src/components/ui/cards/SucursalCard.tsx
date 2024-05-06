import { FC, useState } from "react";
import { ISucursal } from "../../../types/empresa";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import {
	Card,
	CardActions,
	CardHeader,
	CardMedia,
	IconButton,
} from "../../ui/styled/StyledCard";
import { setSucursal } from "../../../redux/slices/SelectedData";
import StoreIcon from "@mui/icons-material/Store";
import GenericModal from "../shared/GenericModal";

interface SucursalCardProps {
	sucursal: ISucursal;
}

const SucursalCard: FC<SucursalCardProps> = ({ sucursal }) => {
	const navigate = useNavigate();
	// Obtención del despachador de acciones de Redux
	const dispatch = useAppDispatch();

	const [showModal, setShowModal] = useState(false);

	const onOpenModal = () => setShowModal(true);
	const onCloseModal = () => setShowModal(false);

	const handleEditClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.stopPropagation(); // Detiene la propagación del evento
		onOpenModal();
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
					subheader={`${sucursal.horarioApertura}-${sucursal.horarioCierre}`}
				/>
				<CardMedia component="img" image={sucursal.icon} />
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
				title={"Editar sucursal"}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={onCloseModal}
			>
				<>Formulario empresa</>
			</GenericModal>
		</>
	);
};

export default SucursalCard;
