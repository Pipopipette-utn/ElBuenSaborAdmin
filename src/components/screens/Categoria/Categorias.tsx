import {
	LinearProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
	IconButton,
} from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import RefreshIcon from "@mui/icons-material/Refresh";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { CategoriaAccordion } from "../../ui/accordion/CategoriaAccordion";
import { useEffect, useState, useCallback } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { CategoriaForm } from "../../ui/forms/CategoriaForm";
import { emptyCategoria } from "../../../types/emptyEntities";
import { ICategoria } from "../../../types/empresa";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { setCategoriasSucursal } from "../../../redux/slices/SelectedData";
import { SucursalService } from "../../../services/SucursalService";

const Categorias = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
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

	const traerCategorias = useCallback(async () => {
		if (sucursal) {
			const sucursalService = new SucursalService("/sucursales");
			try {
				dispatch(setCategoriasSucursal("loading"));
				const categorias =
					(await sucursalService.getCategorias(sucursal.id!)) ?? [];
				dispatch(setCategoriasSucursal(categorias));
			} catch (e) {
				dispatch(setCategoriasSucursal(null));
			}
		}
	}, [dispatch, sucursal]);

	const handleReload = () => {
		dispatch(setCategoriasSucursal(null));
		traerCategorias();
	};

	useEffect(() => {
		const filterCategorias = () => {
			if (categorias !== "loading") setFilteredCategorias(categorias);
		};
		setFilteredCategorias(null);
		filterCategorias();
	}, [categorias]);

	useEffect(() => {
		let filtered = categorias !== "loading" ? categorias : [];
		const filterByDenominacion = (categoryList: ICategoria[]) => {
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
					disabledButton={user!.rol! === "CAJERO"}
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
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography variant="h5">Todas las categorias</Typography>
						<IconButton onClick={handleReload}>
							<RefreshIcon color="primary" />
						</IconButton>
					</Stack>
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

export default Categorias;
