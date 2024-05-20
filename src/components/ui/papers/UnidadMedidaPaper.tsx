import { FC, useState } from "react";
import { Tooltip, IconButton, Typography } from "@mui/material";
import { HorizontalPaper } from "../styled/StyledPaper";
import { Stack } from "@mui/material";
import { IUnidadMedida } from "../../../types/empresa";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ScaleIcon from "@mui/icons-material/Scale";
import GenericModal from "../shared/GenericModal";
import { UnidadMedidaForm } from "../forms/UnidadMedidaForm";
import { UnidadMedidaService } from "../../../services/UnidadMedidaService";
import { setUnidadMedidas } from "../../../redux/slices/Business";
import { useAppSelector } from "../../../redux/hooks";
import { useDispatch } from "react-redux";
import { AlertDialog } from "../shared/DialogAlert";

interface UnidadMedidaPaperProps {
	unidadMedida: IUnidadMedida;
}

export const UnidadMedidaPaper: FC<UnidadMedidaPaperProps> = ({
	unidadMedida,
}) => {
	const unidadesdMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleDelete = async () => {
		const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
		await unidadMedidaService.delete(unidadMedida.id!);
		const newUnidades = unidadesdMedida!.filter(
			(u) => u.id != unidadMedida.id!
		);
		dispatch(setUnidadMedidas(newUnidades));
		handleCloseAlert();
	};

	return (
		<>
			<HorizontalPaper>
				<Typography variant="body1">{unidadMedida.denominacion}</Typography>
				<Stack direction="row">
					<Tooltip title="Editar">
						<IconButton size="small" color="primary" onClick={handleOpenModal}>
							<EditIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Eliminar">
						<IconButton size="small" color="primary" onClick={handleOpenAlert}>
							<DeleteOutlineIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Stack>
			</HorizontalPaper>
			<AlertDialog
				open={showAlert}
				title={"¿Estás seguro de que querés eliminar la unidad de medida?"}
				content={""}
				onAgreeClose={handleDelete}
				onDisagreeClose={handleCloseAlert}
			/>
			<GenericModal
				title={"Editar unidad de medida"}
				icon={<ScaleIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<UnidadMedidaForm
					unidadMedida={unidadMedida}
					onClose={handleCloseModal}
				/>
			</GenericModal>
		</>
	);
};
