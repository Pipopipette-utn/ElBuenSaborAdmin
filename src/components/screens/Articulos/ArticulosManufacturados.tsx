import { LinearProgress, Stack, Typography } from "@mui/material";
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
import { usePagination } from "../../../hooks/usePagination";
import { useMessages } from "../../../hooks/useMessages";
import { useFormModal } from "../../../hooks/useFormModal";
import { useArticuloActions } from "../../../hooks/useArticuloActions";

const ArticulosManufacturados = () => {
	const articuloManufacturadoService = new ArticuloManufacturadoService(
		"/articulosManufacturados"
	);
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal) ?? [];
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const {
		page,
		rowsPerPage,
		totalRows,
		onPageChange,
		onRowsPerPageChange,
		setTotalRows,
	} = usePagination();

	const {
		showSuccess,
		showError,
		onShowError,
		onShowSuccess,
		onCloseError,
		onCloseSuccess,
	} = useMessages();

	const { isOpen: isModalOpen, onOpenModal, onCloseModal } = useFormModal();

	const {
		idArticuloSeleccionado,
		articuloSeleccionado,
		showAlertBaja,
		showAlertAlta,
		showAlertAltaSucursal,
		showDetailsModal,
		setArticuloSeleccionado,
		onHideAlertBaja,
		onHideAlertAlta,
		onHideAlertAltaSucursal,
		onShowDetailsModal,
		onHideDetailsModal,
		onDeleteClick,
		onAltaClick,
		onAltaSucursalClick,
	} = useArticuloActions();

	const [articulosManufacturados, setArticulosManufacturados] = useState<
		IArticuloManufacturado[]
	>([]);
	const [reload, setReload] = useState(false);
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
	}, [reload, sucursal, page, rowsPerPage, nameFilter, categoryFilter]);

	const handleOpenEditModal = (articuloId: number) => {
		const articuloEncontrado = articulosManufacturados?.find(
			(a) => a.id == articuloId
		);
		setArticuloSeleccionado(articuloEncontrado!);
		onOpenModal();
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
		setArticuloSeleccionado(articuloEncontrado!);
		onShowDetailsModal();
	};

	const handleDelete = async () => {
		try {
			const productoService = new ArticuloManufacturadoService(
				"/articulosManufacturados"
			);
			await productoService.delete(idArticuloSeleccionado!);
			const articuloEncontrado = articulosManufacturados?.find(
				(a) => a.id == idArticuloSeleccionado
			);
			const newArticulo = { ...articuloEncontrado!, baja: false };
			dispatch(editArticuloManufacturadoSucursal(newArticulo));
			onHideAlertBaja();
			onShowSuccess("Artículo dado de baja con éxito");
		} catch (e: any) {
			onShowError("Error al dar de baja artículo: " + e);
		}
	};

	const handleAlta = async () => {
		try {
			await articuloManufacturadoService.alta(idArticuloSeleccionado!);
			const articuloEncontrado = articulosManufacturados?.find(
				(a) => a.id == idArticuloSeleccionado
			);
			const newArticulo = { ...articuloEncontrado!, baja: false };
			dispatch(editArticuloManufacturadoSucursal(newArticulo));
			onHideAlertAlta();
			onShowSuccess("Artículo dado de alta con éxito");
		} catch (e: any) {
			onShowError("Error al dar de alta artículo: " + e);
		}
	};

	const handleAltaSucursal = async (sucursales: ISucursalDTO[]) => {
		try {
			if (!Array.isArray(sucursal)) {
				const filteredSucursales = sucursales.filter(
					(s) => s.id !== sucursal.id!
				);
				await articuloManufacturadoService.altaSucursales(
					idArticuloSeleccionado!,
					filteredSucursales
				);
				onHideAlertAltaSucursal();
				onShowSuccess("Artículo dado de alta con éxito.");
			}
		} catch (e: any) {
			onShowError("Error al dar de alta artículo: " + e);
		}
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
					quantity={totalRows}
					activeEntities={"Productos activos"}
					buttonText={"Nuevo producto"}
					disabledButton={user!.rol! === "CAJERO"}
					onClick={() => {
						setArticuloSeleccionado(null);
						onOpenModal();
					}}
				>
					<FilterFields
						nameFilter={nameFilter ?? ""}
						onNameFilterChange={handleFilterChange}
						categorias={
							categorias !== "loading"
								? categorias.filter((c) => !c.baja)
								: []
						}
						categoryFilter={categoryFilter}
						onCategoryFilterChange={handleCategoryFilterChange}
					/>
				</GenericHeaderStack>
				<Stack sx={{ overflow: "hidden" }}>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todos los productos manufacturados
					</Typography>
					<Stack
						direction="row"
						width="100%"
						height="100%"
						justifyContent="center"
						sx={{ flex: 1, overflow: "auto" }}
					>
						{loading ? (
							<LinearProgress sx={{ width: "100%" }} />
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
									{ label: "Categoria", key: "categoria" },
									{ label: "Acciones", key: "acciones" },
								]}
								totalRows={totalRows}
								page={page}
								rowsPerPage={rowsPerPage}
								onEdit={handleOpenEditModal}
								onSeeDetails={handleSeeDetails}
								onAlta={onAltaClick}
								onAltaSucursal={onAltaSucursalClick}
								onDelete={onDeleteClick}
								onPageChange={onPageChange}
								onRowsPerPageChange={onRowsPerPageChange}
							/>
						)}
					</Stack>
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={
					articuloSeleccionado
						? "Editar artículo manufacturado"
						: "Crear artículo manufacturado"
				}
				icon={<LocalMallIcon fontSize="large" />}
				open={isModalOpen}
				handleClose={onCloseModal}
			>
				<ArticuloManufacturadoForm
					initialArticuloManufacturado={
						articuloSeleccionado != null
							? (articuloSeleccionado as IArticuloManufacturado)
							: emptyArticuloManufacturado
					}
					onClose={onCloseModal}
					onShowSuccess={onShowSuccess}
					onShowError={onShowError}
					onReload={() => setReload(!reload)}
				/>
			</GenericModal>

			<GenericModal
				title={"Dar de alta artículo manufacturado"}
				icon={<LocalMallIcon fontSize="large" />}
				open={showAlertAltaSucursal}
				handleClose={onHideAlertAltaSucursal}
			>
				<SucursalesSelector
					selected={
						articuloSeleccionado && articuloSeleccionado.sucursal
							? [articuloSeleccionado.sucursal]
							: []
					}
					handleSubmit={handleAltaSucursal}
					buttonTitle={"Dar de alta en sucursales"}
				/>
			</GenericModal>
			{articuloSeleccionado && (
				<ArticuloManufacturadoDetails
					articuloManufacturado={
						articuloSeleccionado! as IArticuloManufacturado
					}
					open={showDetailsModal}
					handleClose={onHideDetailsModal}
				/>
			)}
			<AlertDialog
				open={showAlertAlta}
				title={"¿Estás seguro de que querés dar de alta el artículo"}
				content={""}
				onAgreeClose={handleAlta}
				onDisagreeClose={onHideAlertAlta}
			/>
			<AlertDialog
				open={showAlertBaja}
				title={"¿Estás seguro de que querés dar de baja el artículo?"}
				content={
					"Luego podrás acceder al artículo para darlo de alta nuevamente"
				}
				onAgreeClose={handleDelete}
				onDisagreeClose={onHideAlertBaja}
			/>
			<SuccessMessage
				open={!!showSuccess}
				onClose={onCloseSuccess}
				message={showSuccess}
			/>
			<ErrorMessage
				open={!!showError}
				onClose={onCloseError}
				message={showError}
			/>
		</>
	);
};

export default ArticulosManufacturados;
