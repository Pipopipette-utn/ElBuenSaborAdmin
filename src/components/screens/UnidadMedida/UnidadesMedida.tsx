import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { UnidadMedidaPaper } from "../../ui/papers/UnidadMedidaPaper";

export const UnidadesMedida = () => {
	const unidadesdMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleClick = () => handleOpenModal();

	return (
		<>
			<GenericDoubleStack>
				<GenericHeaderStack
					icon={
						<StoreMallDirectoryIcon
							color="primary"
							sx={{ width: "40px", height: "40px" }}
						/>
					}
					quantity={unidadesdMedida?.length ?? 0}
					activeEntities={"Unidades de medida"}
					buttonText={"Nueva unidad de medida"}
					onClick={handleClick}
				/>
				<Stack sx={{ p: "12px" }}>
					<Typography variant="h5" sx={{ pb: "12px" }}>
						Todas las unidades de medida
					</Typography>
					<Stack direction="column"  spacing={2} sx={{ p: "12px" }}>
						{unidadesdMedida &&
							unidadesdMedida.map((unidad, index) => (
								<UnidadMedidaPaper key={index} unidadMedida={unidad} />
							))}
					</Stack>
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear unidad de medida"}
				icon={<LocalOfferIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<>Formulario unidad medida</>
			</GenericModal>
		</>
	);
};
