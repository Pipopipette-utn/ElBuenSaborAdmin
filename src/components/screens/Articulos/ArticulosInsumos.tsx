import { Stack, Typography, CircularProgress } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
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
import { ArticuloInsumoDetails } from "../../ui/details/ArticuloInsumoDetails";
import FilterFields from "../../ui/shared/FilterFields";
import { setInsumosSucursal } from "../../../redux/slices/SelectedData";

export const ArticulosInsumos = () => {
	const articuloInsumoService = new ArticuloInsumoService("/articulosInsumos");
	const categorias =
		useAppSelector((state) => state.selectedData.categoriasSucursal) ?? [];

	const [showModal, setShowModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [showAlertAlta, setShowAlertAlta] = useState(false);
	const [idArticulo, setIdArticulo] = useState<number>();
	const [articulo, setArticulo] = useState<IArticuloInsumo | null>(null);
	const [articulosInsumos, setArticulosInsumos] = useState<IArticuloInsumo[]>(
		[]
	);
	const [totalRows, setTotalRows] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(6);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");

	const dispatch = useAppDispatch();
	const articulosRedux = useAppSelector(
		(state) => state.selectedData.articulosInsumosSucursal
	);
	useEffect(() => {
		if (articulosRedux) setArticulosInsumos(articulosRedux);
	}, [articulosRedux]);

	useEffect(() => {
		const findArticulos = async () => {
			setLoading(true);
			const response = await articuloInsumoService.getAllPagedIncludeDeleted(
				page,
				rowsPerPage
			);
			setArticulosInsumos(response.data);
			dispatch(setInsumosSucursal(response.data));
			setTotalRows(response.total);
			setLoading(false);
		};
		findArticulos();
	}, [page, rowsPerPage]);

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
		setArticulosInsumos(filtered);
	}, [filter, categoryFilter]);

	const handleCategoryFilterChange = (value: string | null) => {
		setCategoryFilter(value ?? "");
	};

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => {
		setArticulo(null);
		setShowModal(false);
	};

	const handleOpenDetailsModal = () => setShowDetailsModal(true);
	const handleCloseDetailsModal = () => {
		setArticulo(null);
		setShowDetailsModal(false);
	};

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleOpenAlertAlta = () => setShowAlertAlta(true);
	const handleCloseAlertAlta = () => setShowAlertAlta(false);

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

	const handleSeeDetails = (articuloId: number) => {
		const articuloEncontrado = articulosInsumos?.find(
			(a) => a.id == articuloId
		);
		setArticulo(articuloEncontrado!);
		handleOpenDetailsModal();
	};

	const handleDelete = async () => {
		const insumoService = new ArticuloInsumoService("/articulosInsumos");
		await insumoService.delete(idArticulo!);
		const newInsumos = articulosInsumos!.filter((a) => a.id != idArticulo);
		setArticulosInsumos(newInsumos);
		handleCloseAlert();
	};

	const handleAltaClick = (articuloId: number) => {
		handleOpenAlertAlta();
		setIdArticulo(articuloId);
	};

	const handleAlta = async () => {
		const insumoService = new ArticuloInsumoService("/articulosInsumos");
		await insumoService.alta(idArticulo!);
		//const newArticulo = { ...articulo, baja: false };
		//dispatch(editArticuloInsumo(newArticulo));
		handleCloseAlertAlta();
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage(newRowsPerPage);
	};

	return (
		<>
			<GenericDoubleStack>
				<GenericHeaderStack
					icon={
						<ShoppingCartIcon
							color="primary"
							sx={{ width: "35px", height: "35px" }}
						/>
					}
					quantity={articulosInsumos?.length ?? 0}
					activeEntities={"Insumos activos"}
					buttonText={"Nuevo insumo"}
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
						Todos los insumos
					</Typography>
					<Stack direction="row" width="100%" justifyContent="center">
						{loading ? (
							<CircularProgress sx={{ mt: 6 }} />
						) : (
							<GenericTable
								onDelete={handleDeleteClick}
								onSeeDetails={handleSeeDetails}
								onEdit={handleOpenEditModal}
								onAlta={handleAltaClick}
								data={articuloInsumoService.articulosInsumosToDTO(
									articulosInsumos!
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
								totalRows={totalRows}
								page={page}
								rowsPerPage={rowsPerPage}
								onPageChange={handlePageChange}
								onRowsPerPageChange={handleRowsPerPageChange}
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
			{articulo && (
				<ArticuloInsumoDetails
					articuloInsumo={articulo!}
					open={showDetailsModal}
					handleClose={handleCloseDetailsModal}
				/>
			)}

			<AlertDialog
				open={showAlertAlta}
				title={"¿Estás seguro de que querés dar de alta el artículo"}
				content={""}
				onAgreeClose={handleAlta}
				onDisagreeClose={handleCloseAlertAlta}
			/>

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
