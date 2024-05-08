import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import SucursalCardDetails from "../../ui/cards/SucursalCardDetails";
import { useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import StoreIcon from "@mui/icons-material/Store";

export const Sucursales = () => {
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);

	const [showModal, setShowModal] = useState(false);

	const onOpenModal = () => setShowModal(true);
	const onCloseModal = () => setShowModal(false);

	const handleClick = () => onOpenModal();
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
					quantity={sucursales?.length ?? 0}
					activeEntities={"Sucursales activas"}
					buttonText={"Nueva sucursal"}
					onClick={handleClick}
				/>
				<>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todas las sucursales
					</Typography>
					<Stack direction="row" sx={{ flexWrap: "wrap", overflowY: "auto" }}>
						{sucursales &&
							sucursales.map((sucursal, index) => (
								<SucursalCardDetails sucursal={sucursal} key={index} />
							))}
					</Stack>
				</>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear sucursal"}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={onCloseModal}
			>
				<>Formulario sucursal</>
			</GenericModal>
		</>
	);
};
