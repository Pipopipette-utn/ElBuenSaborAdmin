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
import {
	editArticuloInsumoSucursal,
	setInsumosSucursal,
} from "../../../redux/slices/SelectedData";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { SucursalesSelector } from "../../ui/forms/SucursalesSelector";
import { ISucursalDTO } from "../../../types/dto";

const ArticulosInsumos = () => {
	const insumoService = new ArticuloInsumoService("/articulosInsumos");
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal) ?? [];
	const categorias =
		useAppSelector((state) => state.selectedData.categoriasSucursal) ?? [];

	const [showModal, setShowModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [showAlertAlta, setShowAlertAlta] = useState(false);
	const [showAlertAltaSucursal, setShowAlertAltaSucursal] = useState(false);
	const [idArticulo, setIdArticulo] = useState<number>();
	const [articulo, setArticulo] = useState<IArticuloInsumo | null>(null);
	const [articulosInsumos, setArticulosInsumos] = useState<IArticuloInsumo[]>(
		[]
	);
	const [totalRows, setTotalRows] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(6);
	const [loading, setLoading] = useState(false);
	const [nameFilter, setNameFilter] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<ICategoria | null>(null);

	const dispatch = useAppDispatch();
	const articulosRedux = useAppSelector(
		(state) => state.selectedData.articulosInsumosSucursal
	);

	useEffect(() => {
		if (articulosRedux) setArticulosInsumos(articulosRedux);
	}, [articulosRedux]);

	const handleNameFilterChange = (filtro: string | null) => {
		setNameFilter(filtro);
	};

	const handleCategoryFilterChange = (value: ICategoria | null) => {
		setCategoryFilter(value);
	};

	useEffect(() => {
		let filtered = articulosInsumos;
		const findArticulos = async () => {
			if (sucursal !== null && !Array.isArray(sucursal)) {
				setLoading(true);
				const response = await insumoService.getAllPagedBySucursal(
					sucursal!.id!,
					page,
					rowsPerPage
				);
				filtered = response.data;
				dispatch(setInsumosSucursal(response.data));
				setTotalRows(response.total);
				setLoading(false);
			}
		};

		const filterInsumos = async () => {
			if (sucursal && !Array.isArray(sucursal)) {
				setLoading(true);
				const filteredArticulos = await insumoService.getAllPagedFiltered(
					sucursal!.id!,
					page,
					rowsPerPage,
					categoryFilter !== null ? categoryFilter.id! : undefined,
					nameFilter !== null ? nameFilter : undefined
				);
				filtered = filteredArticulos.data;
				dispatch(setInsumosSucursal(filteredArticulos.data));
				setTotalRows(filteredArticulos.total);
				setLoading(false);
			}
		};
		if (categoryFilter == null && nameFilter == null) findArticulos();
		else filterInsumos();

		setArticulosInsumos(filtered);
	}, [sucursal, page, rowsPerPage, nameFilter, categoryFilter]);

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

	const handleOpenAlertAltaSucursal = () => setShowAlertAltaSucursal(true);
	const handleCloseAlertAltaSucursal = () => setShowAlertAltaSucursal(false);

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
		try {
			await insumoService.delete(idArticulo!);
			const newArticulo = { ...articulo!, baja: true };
			dispatch(editArticuloInsumoSucursal(newArticulo));
			handleCloseAlert();
			handleShowSuccess("Artículo dado de baja con éxito");
		} catch (e: any) {
			handleShowError("Error al dar de baja artículo: " + e);
		}
	};

	const handleAltaClick = (articuloId: number) => {
		const articuloEncontrado = articulosInsumos?.find(
			(a) => a.id == articuloId
		);
		handleOpenAlertAlta();
		setIdArticulo(articuloId);
		setArticulo(articuloEncontrado!);
	};

	const handleAlta = async () => {
		try {
			await insumoService.alta(idArticulo!);
			const newArticulo = { ...articulo!, baja: false };
			dispatch(editArticuloInsumoSucursal(newArticulo));
			handleCloseAlertAlta();
			handleShowSuccess("Artículo dado de alta con éxito");
		} catch (e: any) {
			handleShowError("Error al dar de alta artículo: " + e);
		}
	};

	const handleAltaSucursalClick = (articuloId: number) => {
		const articuloEncontrado = articulosInsumos?.find(
			(a) => a.id == articuloId
		);
		handleOpenAlertAltaSucursal();
		setIdArticulo(articuloId);
		setArticulo(articuloEncontrado!);
	};

	const handleAltaSucursal = async (sucursales: ISucursalDTO[]) => {
		try {
			if (!Array.isArray(sucursal)) {
				const filteredSucursales = sucursales.filter(
					(s) => s.id !== sucursal.id!
				);
				await insumoService.altaSucursales(
					idArticulo!,
					filteredSucursales,
				);
				handleCloseAlertAltaSucursal();
				handleShowSuccess("Artículo dado de alta con éxito.");
			}
		} catch (e: any) {
			handleShowError("Error al dar de alta artículo: " + e);
		}
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage(newRowsPerPage);
	};

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
						<ShoppingCartIcon
							color="primary"
							sx={{ width: "35px", height: "35px" }}
						/>
					}
					quantity={totalRows}
					activeEntities={"Insumos activos"}
					buttonText={"Nuevo insumo"}
					disabledButton={user!.rol! === "CAJERO" || user!.rol! === "COCINERO"}
					onClick={handleOpenModal}
				>
					<FilterFields
						nameFilter={nameFilter ?? ""}
						onNameFilterChange={handleNameFilterChange}
						categorias={
							categorias !== "loading"
								? categorias.filter((c) => c.esInsumo)
								: []
						}
						categoryFilter={categoryFilter}
						onCategoryFilterChange={handleCategoryFilterChange}
					/>
				</GenericHeaderStack>
				<Stack sx={{ overflow: "hidden" }}>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los insumos
					</Typography>
					<Stack
						className="tableContainer"
						direction="row"
						width="100%"
						height="100%"
						justifyContent="center"
						sx={{ flex: 1, overflow: "auto" }}
					>
						{loading ? (
							<CircularProgress sx={{ mt: 6 }} />
						) : (
							<GenericTable
								onDelete={handleDeleteClick}
								onSeeDetails={handleSeeDetails}
								onEdit={handleOpenEditModal}
								onAlta={handleAltaClick}
								onAltaSucursal={handleAltaSucursalClick}
								data={insumoService.articulosInsumosToDTO(articulosInsumos!)}
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
					onShowSuccess={handleShowSuccess}
					onShowError={handleShowError}
				/>
			</GenericModal>

			<GenericModal
				title={"Dar de alta insumo"}
				icon={<ShoppingCartIcon fontSize="large" />}
				open={showAlertAltaSucursal}
				handleClose={handleCloseAlertAltaSucursal}
			>
				<SucursalesSelector
					selected={articulo && articulo.sucursal ? [articulo.sucursal] : []}
					handleSubmit={handleAltaSucursal}
					buttonTitle={"Dar de alta en sucursales"}
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
				title={"¿Estás seguro de que querés dar de baja el artículo?"}
				content={
					"Luego podrás acceder al artículo para darlo de alta nuevamente."
				}
				onAgreeClose={handleDelete}
				onDisagreeClose={handleCloseAlert}
			/>
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

export default ArticulosInsumos;
