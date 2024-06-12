import { LinearProgress, Stack, Typography, IconButton } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import ScaleIcon from "@mui/icons-material/Scale";
import RefreshIcon from "@mui/icons-material/Refresh";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { useState, useCallback } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import { UnidadMedidaPaper } from "../../ui/papers/UnidadMedidaPaper";
import { UnidadMedidaForm } from "../../ui/forms/UnidadMedidaForm";
import { emptyUnidadDeMedida } from "../../../types/emptyEntities";
import { useDispatch } from "react-redux";
import { UnidadMedidaService } from "../../../services/UnidadMedidaService";
import { setUnidadMedidas } from "../../../redux/slices/Business";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";

const UnidadesMedida = () => {
	const unidadesdMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleClick = () => handleOpenModal();

	const traerUnidades = useCallback(async () => {
		const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
		try {
			dispatch(setUnidadMedidas("loading"));
			const unidadMedidas = await unidadMedidaService.getAll();
			dispatch(setUnidadMedidas(unidadMedidas));
		} catch (e) {
			dispatch(setUnidadMedidas(null));
		}
	}, [dispatch]);

	const handleReload = () => {
		dispatch(setUnidadMedidas(null));
		traerUnidades();
	};

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

	return (
		<>
			<GenericDoubleStack>
				<GenericHeaderStack
					icon={
						<ScaleIcon color="primary" sx={{ width: "40px", height: "40px" }} />
					}
					quantity={unidadesdMedida?.length ?? 0}
					activeEntities={"Unidades de medida"}
					buttonText={"Nueva unidad de medida"}
					onClick={handleClick}
				/>
				<>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography variant="h5">Todas las unidades de medida</Typography>
						<IconButton onClick={handleReload}>
							<RefreshIcon color="primary" />
						</IconButton>
					</Stack>
					<Stack direction="column" spacing={2} sx={{ p: "12px" }}>
						{unidadesdMedida &&
							unidadesdMedida !== "loading" &&
							unidadesdMedida.map((unidad, index) => (
								<UnidadMedidaPaper
									key={index}
									unidadMedida={unidad}
									onShowSuccess={handleShowSuccess}
									onShowError={handleShowError}
								/>
							))}
					</Stack>
					{unidadesdMedida === "loading" && (
						<LinearProgress sx={{ width: "100%" }} />
					)}
					{unidadesdMedida === null && (
						<Typography>
							Ups! No hay unidades de medida para mostrar.
						</Typography>
					)}
				</>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear unidad de medida"}
				icon={<ScaleIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<UnidadMedidaForm
					unidadMedida={emptyUnidadDeMedida}
					onClose={handleCloseModal}
					onShowSuccess={handleShowSuccess}
					onShowError={handleShowError}
				/>
			</GenericModal>
			<SuccessMessage
				open={!!showSuccess}
				onClose={handleCloseSuccess}
				message={showSuccess}
			/>
			<ErrorMessage
				open={!!showError}
				onClose={handleCloseError}
				message={showError}
			/>
		</>
	);
};
export default UnidadesMedida;