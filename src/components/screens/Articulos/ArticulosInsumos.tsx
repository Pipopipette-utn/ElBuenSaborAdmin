import {
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
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { GenericTable } from "../../ui/shared/GenericTable";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ArticuloInsumoService } from "../../../services/ArticuloInsumoService";
import { InsumoForm } from "../../ui/forms/InsumoForm";
import { emptyInsumo } from "../../../types/emptyEntities";
import { IArticuloInsumo, ICategoria } from "../../../types/empresa";
import { AlertDialog } from "../../ui/shared/AlertDialog";
import { setArticulosInsumos } from "../../../redux/slices/Business";

export const ArticulosInsumos = () => {
	const dispatch = useAppDispatch();

	const articuloInsumoService = new ArticuloInsumoService("/articulosInsumos");
	const articulosInsumos = useAppSelector(
		(state) => state.business.articulosInsumos
	);
	const categorias = useAppSelector((state) => state.selectedData.categoriasSucursal) ?? [];

	useEffect(() => {
		const traerUnidades = async () => {
			const articulosInsumos = await articuloInsumoService.getAll();
			dispatch(setArticulosInsumos(articulosInsumos));
		};
		traerUnidades();
		setFilteredInsumos(articulosInsumos);
	}, []);

	const [showModal, setShowModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [idArticulo, setIdArticulo] = useState<number>();

	const [articulo, setArticulo] = useState<IArticuloInsumo | null>(null);

	const [filteredInsumos, setFilteredInsumos] = useState(articulosInsumos);
	const [filter, setFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	useEffect(() => {
		let filtered = articulosInsumos;
		const filterByDenominacion = () => {
			filtered = filtered!.filter((insumo) =>
				insumo.denominacion.toLowerCase().includes(filter.toLowerCase())
			);
		};
		const filterByCategory = (cf: string) => {
			const isCategoryOrSubcategory = (categoria: ICategoria) => {
				if (categoria.denominacion == cf) {
					return true;
				}
				if (categoria.categoriaPadre) {
					return categoria.categoriaPadre.denominacion == cf;
				}
				return false;
			};

			filtered = filtered!.filter(
				(insumo) =>
					insumo.categoria && isCategoryOrSubcategory(insumo.categoria)
			);
		};

		if (filter !== "") {
			filterByDenominacion();
		}
		if (categoryFilter !== "") {
			filterByCategory(categoryFilter);
		}
		setFilteredInsumos(filtered);
	}, [filter, categoryFilter]);

	const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
		setCategoryFilter(event.target.value);
	};

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => {
		setArticulo(null);
		setShowModal(false);
	};

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleOpenEditModal = (articuloId: number) => {
		const articuloEncontrado = articulosInsumos?.find(
			(a) => a.id == articuloId
		);
		setArticulo(articuloEncontrado!);
		setShowModal(true);
	};

	const handleDeleteClick = (articuloId: number) => {
		handleOpenAlert();
		setIdArticulo(articuloId);
	};

	const handleDelete = async () => {
		const insumoService = new ArticuloInsumoService("/articulosInsumos");
		await insumoService.delete(idArticulo!);
		const newInsumos = articulosInsumos!.filter((a) => a.id != idArticulo);
		dispatch(setArticulosInsumos(newInsumos));
		handleCloseAlert();
	};

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
					onClick={handleOpenModal}
				>
					<Stack direction="row">
						<Stack
							spacing={1}
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							paddingLeft={3}
						>
							<Typography variant="h6">Buscar por nombre:</Typography>
							<TextField
								size="small"
								variant="outlined"
								value={filter}
								onChange={handleFilterChange}
								sx={{ width: "90px", "& input": { fontSize: "14px" } }}
							/>
						</Stack>
						<Stack
							spacing={1}
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							paddingLeft={3}
						>
							<Typography variant="h6">Filtrar por categoría:</Typography>
							<Select
								size="small"
								value={categoryFilter}
								onChange={handleCategoryFilterChange}
								sx={{ width: "120px", fontSize: "14px" }}
							>
								<MenuItem value="">Ninguna</MenuItem>
								{categorias &&
									categorias!.map((categoria, index) => (
										<MenuItem key={index} value={categoria!.denominacion}>
											{categoria!.denominacion}
										</MenuItem>
									))}
							</Select>
						</Stack>
					</Stack>
				</GenericHeaderStack>
				<Stack sx={{ overflow: "hidden" }}>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los insumos
					</Typography>
					<Stack direction="row">
						{articulosInsumos && (
							<GenericTable
								onDelete={handleDeleteClick}
								onEdit={handleOpenEditModal}
								data={articuloInsumoService.articulosInsumosToDTO(
									filteredInsumos!
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
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={articulo ? "Editar insumo" : "Crear insumo"}
				icon={<ShoppingCartIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<InsumoForm
					initialArticuloInsumo={articulo ? articulo : emptyInsumo}
					onClose={handleCloseModal}
				/>
			</GenericModal>
			<AlertDialog
				open={showAlert}
				title={"¿Estás seguro de que querés eliminar el artículo"}
				content={
					"Luego podrás acceder al artículo para darlo de alta nuevamente"
				}
				onAgreeClose={handleDelete}
				onDisagreeClose={handleCloseAlert}
			/>
		</>
	);
};
