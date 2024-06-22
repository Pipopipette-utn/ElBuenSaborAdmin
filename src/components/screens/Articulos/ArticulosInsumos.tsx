import { Stack, Typography, LinearProgress } from "@mui/material";
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
import { useFormModal } from "../../../hooks/useFormModal";
import { useArticuloActions } from "../../../hooks/useArticuloActions";
import { usePagination } from "../../../hooks/usePagination";
import { useMessages } from "../../../hooks/useMessages";

const ArticulosInsumos = () => {
	const insumoService = new ArticuloInsumoService("/articulosInsumos");
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal) ?? [];
	const categorias =
		useAppSelector((state) => state.selectedData.categoriasSucursal) ?? [];

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

	const [articulosInsumos, setArticulosInsumos] = useState<IArticuloInsumo[]>(
		[]
	);

	const [reload, setReload] = useState(false);
	const [loading, setLoading] = useState(false);
	const [nameFilter, setNameFilter] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<ICategoria | null>(null);

	const dispatch = useAppDispatch();

	const handleNameFilterChange = (filtro: string | null) => {
		setNameFilter(filtro);
	};

	const handleCategoryFilterChange = (value: ICategoria | null) => {
		setCategoryFilter(value);
	};

	const articulosRedux = useAppSelector(
		(state) => state.selectedData.articulosInsumosSucursal
	);

	useEffect(() => {
		if (articulosRedux) setArticulosInsumos(articulosRedux);
	}, [articulosRedux]);

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
	}, [reload, sucursal, page, rowsPerPage, nameFilter, categoryFilter]);

	const handleOpenEditModal = (articuloId: number) => {
		const articuloEncontrado = articulosInsumos?.find(
			(a) => a.id == articuloId
		);
		setArticuloSeleccionado(articuloEncontrado!);
		onOpenModal();
	};

	const handleSeeDetails = (articuloId: number) => {
		const articuloEncontrado = articulosInsumos?.find(
			(a) => a.id == articuloId
		);
		setArticuloSeleccionado(articuloEncontrado!);
		onShowDetailsModal();
	};

	const handleDelete = async () => {
		try {
			await insumoService.delete(idArticuloSeleccionado!);
			const articuloEncontrado = articulosInsumos?.find(
				(a) => a.id == idArticuloSeleccionado
			);
			const newArticulo = { ...articuloEncontrado!, baja: true };
			dispatch(editArticuloInsumoSucursal(newArticulo));
			onHideAlertBaja();
			onShowSuccess("Artículo dado de baja con éxito");
		} catch (e: any) {
			onShowError("Error al dar de baja artículo: " + e);
		}
	};

	const handleAlta = async () => {
		try {
			await insumoService.alta(idArticuloSeleccionado!);
			const articuloEncontrado = articulosInsumos?.find(
				(a) => a.id == idArticuloSeleccionado
			);
			const newArticulo = { ...articuloEncontrado!, baja: false };
			dispatch(editArticuloInsumoSucursal(newArticulo));
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
				await insumoService.altaSucursales(
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
						<ShoppingCartIcon
							color="primary"
							sx={{ width: "35px", height: "35px" }}
						/>
					}
					quantity={totalRows}
					activeEntities={"Insumos activos"}
					buttonText={"Nuevo insumo"}
					disabledButton={user!.rol! === "CAJERO" || user!.rol! === "COCINERO"}
					onClick={() => {
						setArticuloSeleccionado(null);
						onOpenModal();
					}}
				>
					<FilterFields
						nameFilter={nameFilter ?? ""}
						onNameFilterChange={handleNameFilterChange}
						categorias={
							categorias !== "loading"
								? categorias.filter((c) => c.esInsumo && !c.baja)
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
							<LinearProgress sx={{ width: "100%" }} />
						) : (
							<GenericTable
								onDelete={onDeleteClick}
								onSeeDetails={handleSeeDetails}
								onEdit={handleOpenEditModal}
								onAlta={onAltaClick}
								onAltaSucursal={onAltaSucursalClick}
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
								onPageChange={onPageChange}
								onRowsPerPageChange={onRowsPerPageChange}
							/>
						)}
					</Stack>
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={articuloSeleccionado ? "Editar insumo" : "Crear insumo"}
				icon={<ShoppingCartIcon fontSize="large" />}
				open={isModalOpen}
				handleClose={onCloseModal}
			>
				<InsumoForm
					initialArticuloInsumo={
						articuloSeleccionado
							? (articuloSeleccionado as IArticuloInsumo)
							: emptyInsumo
					}
					onClose={onCloseModal}
					onShowSuccess={onShowSuccess}
					onShowError={onShowError}
					onReload={() => setReload(!reload)}
				/>
			</GenericModal>

			<GenericModal
				title={"Dar de alta insumo"}
				icon={<ShoppingCartIcon fontSize="large" />}
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
				<ArticuloInsumoDetails
					articuloInsumo={articuloSeleccionado! as IArticuloInsumo}
					open={showDetailsModal}
					handleClose={onHideDetailsModal}
				/>
			)}

			<AlertDialog
				open={showAlertAlta}
				title={"¿Estás seguro de que querés dar de alta el artículo?"}
				content={""}
				onAgreeClose={handleAlta}
				onDisagreeClose={onHideAlertAlta}
			/>
			<AlertDialog
				open={showAlertBaja}
				title={"¿Estás seguro de que querés dar de baja el artículo?"}
				content={
					"Luego podrás acceder al artículo para darlo de alta nuevamente."
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

export default ArticulosInsumos;
