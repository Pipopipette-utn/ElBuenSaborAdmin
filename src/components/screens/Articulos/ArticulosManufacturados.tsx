import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { GenericTable } from "../../ui/shared/GenericTable";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { ArticuloManufacturadoService } from "../../../services/ArticuloManufacturadoService";
import { IArticuloManufacturado, ICategoria } from "../../../types/empresa";
import { setArticulosManufacturados } from "../../../redux/slices/Business";
import { AlertDialog } from "../../ui/shared/AlertDialog";
import { ArticuloManufacturadoForm } from "../../ui/forms/ArticuloManufacturadoForm";
import { emptyArticuloManufacturado } from "../../../types/emptyEntities";
import FilterFields from "../../ui/shared/FilterFields";
import { ArticuloManufacturadoDetails } from "../../ui/details/ArticuloManufacturadoDetails";

export const ArticulosManufacturados = () => {
	const dispatch = useAppDispatch();

	const articuloManufacturadoService = new ArticuloManufacturadoService(
		"/articulosInsumos"
	);
	const articulosManufacturados = useAppSelector(
		(state) => state.business.articulosManufacturados
	);

	useEffect(() => {
		setFilteredArticulosManufacturados(articulosManufacturados ?? []);
	}, [articulosManufacturados]);

	const [showModal, setShowModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [idArticulo, setIdArticulo] = useState<number>();

	const [articulo, setArticulo] = useState<IArticuloManufacturado | null>(null);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleOpenDetailsModal = () => setShowDetailsModal(true);
	const handleCloseDetailsModal = () => {
		setArticulo(null);
		setShowDetailsModal(false);
	};

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => {
		setArticulo(null);
		setShowModal(false);
	};

	const handleOpenEditModal = (articuloId: number) => {
		const articuloEncontrado = articulosManufacturados?.find(
			(a) => a.id == articuloId
		);
		setArticulo(articuloEncontrado!);
		setShowModal(true);
	};

	const [filteredArticulosManufacturados, setFilteredArticulosManufacturados] =
		useState(articulosManufacturados ?? []);

	const [filter, setFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const categorias =
		useAppSelector((state) => state.selectedData.categoriasSucursal) ?? [];

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	const handleCategoryFilterChange = (value: string | null) => {
		setCategoryFilter(value ?? "");
	};

	useEffect(() => {
		let filtered = articulosManufacturados;
		const filterByDenominacion = () => {
			filtered = filtered!.filter((insumo) =>
				insumo.denominacion.toLowerCase().includes(filter.toLowerCase())
			);
		};
		const filterByCategory = (cf: string) => {
			const isCategoryOrSubcategory = (categoria: ICategoria): boolean => {
				if (categoria.denominacion == cf) {
					return true;
				}
				if (categoria.subCategorias) {
					const subcategories = categoria.subCategorias.filter((sub) =>
						isCategoryOrSubcategory(sub)
					);
					return subcategories.length > 0;
				}
				return false;
			};

			filtered = filtered!.filter(
				(insumo) =>
					insumo.categoria && isCategoryOrSubcategory(insumo.categoria)
			);
			console.log(filtered);
		};

		if (filter !== "") {
			filterByDenominacion();
		}
		if (categoryFilter !== "") {
			filterByCategory(categoryFilter);
		}
		setFilteredArticulosManufacturados(filtered ?? []);
	}, [filter, categoryFilter]);

	const handleSeeDetails = (articuloId: number) => {
		const articuloEncontrado = articulosManufacturados?.find(
			(a) => a.id == articuloId
		);
		setArticulo(articuloEncontrado!);
		handleOpenDetailsModal();
	};

	const handleDeleteClick = (articuloId: number) => {
		handleOpenAlert();
		setIdArticulo(articuloId);
	};

	const handleDelete = async () => {
		const productoService = new ArticuloManufacturadoService(
			"/articulosManufacturados"
		);
		await productoService.delete(idArticulo!);
		const newProductos = articulosManufacturados!.filter(
			(a) => a.id != idArticulo
		);
		dispatch(setArticulosManufacturados(newProductos));
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
					quantity={articulosManufacturados?.length ?? 0}
					activeEntities={"Productos activos"}
					buttonText={"Nuevo producto"}
					onClick={handleOpenModal}
				>
					<FilterFields
						filter={filter}
						onFilterChange={handleFilterChange}
						categorias={categorias}
						categoryFilter={categoryFilter}
						onCategoryFilterChange={handleCategoryFilterChange}
					/>
				</GenericHeaderStack>
				<Stack sx={{ overflow: "hidden" }}>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los productos manufacturados
					</Typography>
					<Stack direction="row">
						{articulosManufacturados && (
							<GenericTable
								data={articuloManufacturadoService.articulosManufacturadosToDTO(
									filteredArticulosManufacturados
								)}
								columns={[
									{ label: "Nombre", key: "denominacion" },
									{ label: "Unidad de medida", key: "unidadMedida" },
									{ label: "Precio", key: "precioVenta" },
									{ label: "Descripcion", key: "descripcion" },
									{ label: "Tiempo (mins)", key: "tiempoEstimadoMinutos" },
									{ label: "Preparacion", key: "preparacion" },
									{ label: "Categoria", key: "categoria" },
									{ label: "Acciones", key: "acciones" },
								]}
								onEdit={handleOpenEditModal}
								onSeeDetails={handleSeeDetails}
								onDelete={handleDeleteClick}
							/>
						)}
					</Stack>
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={
					articulo
						? "Editar artículo manufacturado"
						: "Crear artículo manufacturado"
				}
				icon={<LocalMallIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<ArticuloManufacturadoForm
					initialArticuloManufacturado={
						articulo != null ? articulo : emptyArticuloManufacturado
					}
					onClose={handleCloseModal}
				/>
			</GenericModal>
			{articulo && (
				<ArticuloManufacturadoDetails
					articuloManufacturado={articulo!}
					open={showDetailsModal}
					handleClose={handleCloseDetailsModal}
				/>
			)}
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
