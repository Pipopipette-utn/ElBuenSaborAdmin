import { CircularProgress, Stack, Typography } from "@mui/material";
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
import { AlertDialog } from "../../ui/shared/AlertDialog";
import { ArticuloManufacturadoForm } from "../../ui/forms/ArticuloManufacturadoForm";
import { emptyArticuloManufacturado } from "../../../types/emptyEntities";
import FilterFields from "../../ui/shared/FilterFields";
import { ArticuloManufacturadoDetails } from "../../ui/details/ArticuloManufacturadoDetails";
import {
	editArticuloManufacturadoSucursal,
	setManufacturadosSucursal,
} from "../../../redux/slices/SelectedData";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { ISucursalDTO } from "../../../types/dto";
import { SucursalesSelector } from "../../ui/forms/SucursalesSelector";

export const ArticulosManufacturados = () => {
	const articuloManufacturadoService = new ArticuloManufacturadoService(
		"/articulosManufacturados"
	);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal) ?? [];
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [showAlertAlta, setShowAlertAlta] = useState(false);
	const [showAlertAltaSucursal, setShowAlertAltaSucursal] = useState(false);

	const [idArticulo, setIdArticulo] = useState<number>();
	const [articulo, setArticulo] = useState<IArticuloManufacturado | null>(null);
	const [articulosManufacturados, setArticulosManufacturados] = useState<
		IArticuloManufacturado[]
	>([]);
	const [totalRows, setTotalRows] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(6);

	const [nameFilter, setNameFilter] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<ICategoria | null>(null);
	const categorias =
		useAppSelector((state) => state.selectedData.categoriasSucursal) ?? [];

	const articulosRedux = useAppSelector(
		(state) => state.selectedData.articulosManufacturadosSucursal
	);

	useEffect(() => {
		if (articulosRedux) setArticulosManufacturados(articulosRedux);
	}, [articulosRedux]);

	useEffect(() => {
		let filtered = articulosManufacturados;
		const findArticulos = async () => {
			if (sucursal !== null && !Array.isArray(sucursal)) {
				setLoading(true);
				const response =
					await articuloManufacturadoService.getAllPagedBySucursal(
						sucursal!.id!,
						page,
						rowsPerPage
					);
				filtered = response.data;
				dispatch(setManufacturadosSucursal(response.data));
				setTotalRows(response.total);
				setLoading(false);
			}
		};

		const filterInsumos = async () => {
			console.log(categoryFilter);
			console.log(nameFilter);
			if (sucursal && !Array.isArray(sucursal)) {
				setLoading(true);
				const filteredArticulos =
					await articuloManufacturadoService.getAllPagedFiltered(
						sucursal!.id!,
						page,
						rowsPerPage,
						categoryFilter !== null ? categoryFilter.id! : undefined,
						nameFilter !== null ? nameFilter : undefined
					);
				filtered = filteredArticulos.data;
				dispatch(setManufacturadosSucursal(filteredArticulos.data));
				setTotalRows(filteredArticulos.total);
				setLoading(false);
			}
		};
		if (categoryFilter == null && nameFilter == null) findArticulos();
		else filterInsumos();

		setArticulosManufacturados(filtered);
	}, [sucursal, page, rowsPerPage, nameFilter, categoryFilter]);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleOpenAlertAlta = () => setShowAlertAlta(true);
	const handleCloseAlertAlta = () => setShowAlertAlta(false);

	const handleOpenAlertAltaSucursal = () => setShowAlertAltaSucursal(true);
	const handleCloseAlertAltaSucursal = () => setShowAlertAltaSucursal(false);

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

	const handleFilterChange = (filtro: string | null) => {
		setNameFilter(filtro);
	};

	const handleCategoryFilterChange = (value: ICategoria | null) => {
		setCategoryFilter(value);
	};

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
		try {
			const productoService = new ArticuloManufacturadoService(
				"/articulosManufacturados"
			);
			await productoService.delete(idArticulo!);
			const newArticulo = { ...articulo!, baja: false };
			dispatch(editArticuloManufacturadoSucursal(newArticulo));
			handleCloseAlert();
			handleShowSuccess("Artículo dado de baja con éxito");
		} catch (e: any) {
			handleShowError("Error al dar de baja artículo: " + e);
		}
	};

	const handleAltaClick = (articuloId: number) => {
		const articuloEncontrado = articulosManufacturados?.find(
			(a) => a.id == articuloId
		);
		handleOpenAlertAlta();
		setIdArticulo(articuloId);
		setArticulo(articuloEncontrado!);
	};

	const handleAlta = async () => {
		try {
			await articuloManufacturadoService.alta(idArticulo!);
			const newArticulo = { ...articulo!, baja: false };
			dispatch(editArticuloManufacturadoSucursal(newArticulo));
			handleCloseAlertAlta();
			handleShowSuccess("Artículo dado de alta con éxito");
		} catch (e: any) {
			handleShowError("Error al dar de alta artículo: " + e);
		}
	};

	const handleAltaSucursalClick = (articuloId: number) => {
		const articuloEncontrado = articulosManufacturados?.find(
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
				await articuloManufacturadoService.altaSucursales(
					idArticulo!,
					filteredSucursales
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
						<StoreMallDirectoryIcon
							color="primary"
							sx={{ width: "40px", height: "40px" }}
						/>
					}
					quantity={totalRows}
					activeEntities={"Productos activos"}
					buttonText={"Nuevo producto"}
					onClick={handleOpenModal}
				>
					<FilterFields
						nameFilter={nameFilter ?? ""}
						onNameFilterChange={handleFilterChange}
						categorias={categorias !== "loading" ? categorias : []}
						categoryFilter={categoryFilter}
						onCategoryFilterChange={handleCategoryFilterChange}
					/>
				</GenericHeaderStack>
				<Stack sx={{ overflow: "hidden" }}>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los productos manufacturados
					</Typography>
					<Stack direction="row" width="100%" justifyContent="center">
						{loading ? (
							<CircularProgress sx={{ mt: 6 }} />
						) : (
							<GenericTable
								data={articuloManufacturadoService.articulosManufacturadosToDTO(
									articulosManufacturados
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
								totalRows={totalRows}
								page={page}
								rowsPerPage={rowsPerPage}
								onEdit={handleOpenEditModal}
								onSeeDetails={handleSeeDetails}
								onAlta={handleAltaClick}
								onAltaSucursal={handleAltaSucursalClick}
								onDelete={handleDeleteClick}
								onPageChange={handlePageChange}
								onRowsPerPageChange={handleRowsPerPageChange}
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
					onShowSuccess={handleShowSuccess}
					onShowError={handleShowError}
				/>
			</GenericModal>

			<GenericModal
				title={"Dar de alta artículo manufacturado"}
				icon={<LocalMallIcon fontSize="large" />}
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
				<ArticuloManufacturadoDetails
					articuloManufacturado={articulo!}
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
				title={"¿Estás seguro de que querés dar de baja el artículo?s"}
				content={
					"Luego podrás acceder al artículo para darlo de alta nuevamente"
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
