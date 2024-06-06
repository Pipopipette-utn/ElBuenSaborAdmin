import {
	LinearProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
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
import { ICategoria } from "../../../types/empresa";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";

export const Categorias = () => {
	const categorias = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);
	const [filteredCategorias, setFilteredCategorias] = useState<
		ICategoria[] | null
	>(categorias !== "loading" ? categorias : []);
	const [filter, setFilter] = useState("");
	const [filterEsInsumo, setFilterEsInsumo] = useState("");

	const handleCategoryChange = (event: SelectChangeEvent<string>) => {
		setFilterEsInsumo(event.target.value);
	};

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	useEffect(() => {
		const filterCategorias = async () => {
			if (categorias !== "loading") setFilteredCategorias(categorias);
		};
		setFilteredCategorias(null);
		filterCategorias();
	}, [categorias]);

	useEffect(() => {
		let filtered = categorias !== "loading" ? categorias : [];
		const filterByDenominacion = (categoryList: ICategoria[]) => {
			console.log(categoryList);
			return categoryList.filter((categoria) => {
				if (
					categoria.denominacion.toLowerCase().includes(filter.toLowerCase())
				) {
					return true;
				}
				if (categoria.subCategorias) {
					const matchingSubcategories = filterByDenominacion(
						categoria.subCategorias
					);
					if (matchingSubcategories.length > 0) {
						return true;
					}
				}
				return false;
			});
		};
		const filterByIsInsumo = () => {
			filtered = filtered!.filter((categoria) => {
				if (filterEsInsumo === "esInsumo") return categoria.esInsumo;
				else if (filterEsInsumo === "noEsInsumo") return !categoria.esInsumo;
			});
		};
		if (filter !== "" && filtered != null) {
			filtered = filterByDenominacion(filtered);
		}
		if (filterEsInsumo !== "") {
			filterByIsInsumo();
		}
		setFilteredCategorias(filtered);
	}, [filter, filterEsInsumo]);

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleClick = () => handleOpenModal();

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
						<StoreMallDirectoryIcon
							color="primary"
							sx={{ width: "40px", height: "40px" }}
						/>
					}
					quantity={
						!categorias || categorias === "loading" ? 0 : categorias.length
					}
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
							<Typography variant="h6">Buscar:</Typography>
							<TextField
								size="small"
								variant="outlined"
								value={filter}
								onChange={handleFilterChange}
								sx={{ width: "160px", "& input": { fontSize: "14px" } }}
							/>
						</Stack>
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
								onChange={handleCategoryChange}
								sx={{ width: "200px", fontSize: "14px" }}
							>
								<MenuItem value="">Ninguna</MenuItem>
								<MenuItem value="esInsumo">Es insumo</MenuItem>
								<MenuItem value="noEsInsumo">Articulos manufacturados</MenuItem>
							</Select>
						</Stack>
					</Stack>
				</GenericHeaderStack>
				<Stack sx={{ p: "12px" }}>
					<Typography variant="h5" sx={{ pb: "12px" }}>
						Todas las categorias
					</Typography>
					<Stack direction="column" spacing={2} sx={{ p: "12px" }}>
						{filteredCategorias !== null && filteredCategorias.length !== 0
							? filteredCategorias.map((categoria, index) => {
									if (!categoria.categoriaPadre) {
										return (
											<CategoriaAccordion
												key={index}
												categoria={categoria}
												order={0}
												onShowSuccess={handleShowSuccess}
												onShowError={handleShowError}
											/>
										);
									}
									return null;
							  })
							: categorias &&
							  categorias.length == 0 && (
									<Typography>Ups! No hay ninguna categoría aún.</Typography>
							  )}
						{categorias === "loading" && (
							<LinearProgress sx={{ width: "100%" }} />
						)}
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
						onShowSuccess={handleShowSuccess}
						onShowError={handleShowError}
					/>
				</Stack>
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
