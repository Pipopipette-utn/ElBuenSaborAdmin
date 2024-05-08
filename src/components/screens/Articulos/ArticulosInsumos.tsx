import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { GenericTable } from "../../ui/shared/GenericTable";
import { useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ArticuloInsumoService } from "../../../services/ArticuloInsumoService";

export const ArticulosInsumos = () => {
	const articuloInsumoService = new ArticuloInsumoService("/articulosInsumos");
	const articulosInsumos = useAppSelector(
		(state) => state.business.articulosInsumos
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
					quantity={articulosInsumos?.length ?? 0}
					activeEntities={"Insumos activos"}
					buttonText={"Nuevo insumo"}
					onClick={handleClick}
				/>
				<>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los insumos
					</Typography>
					<Stack direction="row">
						{articulosInsumos && (
							<GenericTable
								data={articuloInsumoService.articulosInsumosToDTO(
									articulosInsumos
								)}
								columns={[
									{ label: "Nombre", key: "denominacion" },
									{ label: "Precio compra", key: "precioCompra" },
									{ label: "Precio venta", key: "precioVenta" },
									{ label: "Unidad de medida", key: "unidadMedida" },
									{ label: "Stock actual", key: "stockActual" },
									{ label: "Stock minimo", key: "stockMinimo" },
									{ label: "Stock máximo", key: "stockMaximo" },
									{ label: "Para elaborar", key: "esParaElaborar" },
									{ label: "Categoria", key: "categoria" },
									{ label: "Acciones", key: "acciones" },
								]}
							/>
						)}
					</Stack>
				</>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear artículo insumo"}
				icon={<ShoppingCartIcon fontSize="large" />}
				open={showModal}
				handleClose={onCloseModal}
			>
				<>Formulario insumo</>
			</GenericModal>
		</>
	);
};
