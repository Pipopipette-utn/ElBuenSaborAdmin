import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { GenericTable } from "../../ui/shared/GenericTable";
import { useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import LocalMallIcon from '@mui/icons-material/LocalMall';

export const ArticulosManufacturados = () => {
	const articulosManufacturados = useAppSelector(
		(state) => state.business.articulosManufacturados
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
					quantity={articulosManufacturados?.length ?? 0}
					activeEntities={"Productos activos"}
					buttonText={"Nuevo producto"}
					onClick={handleClick}
				/>
				<>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los productos manufacturados
					</Typography>
					<Stack direction="row" sx={{ flexWrap: "wrap", overflowY: "auto" }}>
						{articulosManufacturados && (
							<GenericTable
								data={articulosManufacturados}
								columns={[
									{ label: "Nombre", key: "denominacion" },
									{ label: "Precio", key: "precioVenta" },
									{ label: "Descripcion", key: "descripcion" },
									{ label: "Tiempo (mins)", key: "tiempoEstimadoMinutos" },
									{ label: "Preparacion", key: "preparacion" },
									{ label: "Categoria", key: "categoria" },
									{ label: "Unidad", key: `unidadMedida['denominacion']` },
								]}
							/>
						)}
					</Stack>
				</>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear artículo manufacturado"}
				icon={<LocalMallIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<>Formulario articulo manufacturado</>
			</GenericModal>
		</>
	);
};
