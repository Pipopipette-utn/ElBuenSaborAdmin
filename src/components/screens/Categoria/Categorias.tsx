import {
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Typography,
} from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { CategoriaAccordion } from "../../ui/accordion/CategoriaAccordion";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { CategoriaForm } from "../../ui/forms/CategoriaForm";
import { emptyCategoria } from "../../../types/emptyEntities";
import { SucursalService } from "../../../services/SucursalService";

export const Categorias = () => {
	const categorias = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const [filteredCategorias, setFilteredCategorias] = useState(categorias);
	const [filterEsInsumo, setFilterEsInsumo] = useState("");

	const handleFilterChange = (event: SelectChangeEvent<string>) => {
		setFilterEsInsumo(event.target.value);
	};

	useEffect(() => {
		const filterCategorias = async () => {
			if (sucursal) {
				const sucursalService = new SucursalService("/sucursales");
				const categoriasSucursal = sucursalService.getCategorias(sucursal.id!);
				setFilteredCategorias(await categoriasSucursal);
			}
		};
		filterCategorias();
	}, [categorias]);

	useEffect(() => {
		let filtered = categorias;
		const filterByIsInsumo = () => {
			filtered = filtered!.filter((categoria) => {
				if (filterEsInsumo === "esInsumo") return categoria.esInsumo;
				else if (filterEsInsumo === "noEsInsumo") return !categoria.esInsumo;
			});
		};
		if (filterEsInsumo !== "") {
			filterByIsInsumo();
		}
		setFilteredCategorias(filtered);
	}, [filterEsInsumo]);

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
					quantity={filteredCategorias?.length ?? 0}
					activeEntities={"Categorias activas"}
					buttonText={"Nueva categoria"}
					onClick={handleClick}
				>
					<Stack direction="row">
						<Stack
							spacing={1}
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							paddingLeft={3}
						>
							<Typography variant="h6">Filtrar por:</Typography>
							<Select
								size="small"
								value={filterEsInsumo}
								onChange={handleFilterChange}
								sx={{ width: "140px", fontSize: "14px" }}
							>
								<MenuItem value="">Ninguna</MenuItem>
								<MenuItem value="esInsumo">Es insumo</MenuItem>
								<MenuItem value="noEsInsumo">No es insumo</MenuItem>
							</Select>
						</Stack>
					</Stack>
				</GenericHeaderStack>
				<Stack sx={{ p: "12px" }}>
					<Typography variant="h5" sx={{ pb: "12px" }}>
						Todas las categorias
					</Typography>
					<Stack direction="column" spacing={2} sx={{ p: "12px" }}>
						{filteredCategorias &&
							filteredCategorias.map((categoria, index) => {
								if (!categoria.categoriaPadre) {
									return (
										<CategoriaAccordion
											key={index}
											categoria={categoria}
											order={0}
										/>
									);
								}
								return null;
							})}
					</Stack>
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear categoría"}
				icon={<LocalOfferIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<Stack width="90%">
					<CategoriaForm
						initialCategoria={emptyCategoria}
						onClose={handleCloseModal}
						buttonTitle="Crear categoría"
					/>
				</Stack>
			</GenericModal>
		</>
	);
};
