import { LinearProgress, Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import ScaleIcon from "@mui/icons-material/Scale";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import { UnidadMedidaPaper } from "../../ui/papers/UnidadMedidaPaper";
import { UnidadMedidaForm } from "../../ui/forms/UnidadMedidaForm";
import { emptyUnidadDeMedida } from "../../../types/emptyEntities";
import { useDispatch } from "react-redux";
import { UnidadMedidaService } from "../../../services/UnidadMedidaService";
import { setUnidadMedidas } from "../../../redux/slices/Business";

export const UnidadesMedida = () => {
	const unidadesdMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleClick = () => handleOpenModal();

	useEffect(() => {
		const traerUnidades = async () => {
			const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
			const unidadMedidas = await unidadMedidaService.getAll();
			dispatch(setUnidadMedidas(unidadMedidas));
		};
		traerUnidades();
	}, []);

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
					<Typography variant="h5" sx={{ pb: "12px" }}>
						Todas las unidades de medida
					</Typography>
					<Stack direction="column" spacing={2} sx={{ p: "12px" }}>
						{unidadesdMedida &&
							unidadesdMedida !== "loading" &&
							unidadesdMedida.map((unidad, index) => (
								<UnidadMedidaPaper key={index} unidadMedida={unidad} />
							))}
					</Stack>
					{unidadesdMedida === "loading" && (
						<LinearProgress sx={{ width: "100%" }} />
					)}
					{unidadesdMedida === null && (
						<Typography>Ups! No hay unidades de medida para mostrar.</Typography>
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
				/>
			</GenericModal>
		</>
	);
};
