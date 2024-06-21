import { FC, useState } from "react";
import StoreIcon from "@mui/icons-material/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import GenericModal from "../shared/GenericModal";
import { PromocionForm } from "../forms/PromocionForm";
import { AlertDialog } from "../shared/AlertDialog";
import { IPromocion } from "../../../types/empresa";
import { Accordion } from "../styled/StyledAccordion";
import { AccordionSummary, Chip, Stack, Typography } from "@mui/material";
import { ActionButtons } from "./AccordionButtons";
import { theme } from "../../../styles/theme";
import { Carousel } from "react-responsive-carousel";
import { editPromocionesSucursal } from "../../../redux/slices/SelectedData";
import { PromocionService } from "../../../services/PromocionService";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { SucursalesSelector } from "../forms/SucursalesSelector";
import { ISucursalDTO } from "../../../types/dto";

interface PromocionAccordionProps {
	promocion: IPromocion;
	onShowSuccess: (m: string) => void;
	onShowError: (m: string) => void;
}

export const PromocionAccordion: FC<PromocionAccordionProps> = ({
	promocion,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const promocionService = new PromocionService("/promociones");

	const [showModal, setShowModal] = useState(false);
	const [showBajaAlert, setShowBajaAlert] = useState(false);
	const [showAltaAlert, setShowAltaAlert] = useState(false);
	const [showAlertAltaSucursal, setShowAlertAltaSucursal] = useState(false);

	// Funciones para abrir y cerrar el modal de edición
	const handleOpenEditModal = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.stopPropagation();
		setShowModal(true);
	};
	const handleCloseEditModal = () => setShowModal(false);

	const handleOpenBajaAlert = () => setShowBajaAlert(true);
	const handleCloseBajaAlert = () => setShowBajaAlert(false);

	const handleOpenAltaAlert = () => setShowAltaAlert(true);
	const handleCloseAltaAlert = () => setShowAltaAlert(false);

	const handleOpenAlertAltaSucursal = () => setShowAlertAltaSucursal(true);
	const handleCloseAlertAltaSucursal = () => setShowAlertAltaSucursal(false);

	const handleBaja = async () => {
		try {
			await promocionService.delete(promocion.id!);
			const newPromo = { ...promocion!, baja: true };
			dispatch(editPromocionesSucursal(newPromo));
			handleCloseBajaAlert();
			onShowSuccess("Artículo dado de baja con éxito");
		} catch (e: any) {
			onShowError("Error al dar de baja artículo: " + e);
		}
	};

	const handleAlta = async () => {
		try {
			await promocionService.alta(promocion.id!);
			const newPromo = { ...promocion!, baja: false };
			dispatch(editPromocionesSucursal(newPromo));
			handleCloseBajaAlert();
			onShowSuccess("Artículo dado de alta con éxito");
		} catch (e: any) {
			onShowError("Error al dar de alta artículo: " + e);
		}
	};

	const handleAltaSucursal = async (sucursales: ISucursalDTO[]) => {
		try {
			if (!Array.isArray(sucursal)) {
				const filteredSucursales = sucursales.filter(
					(s) => s.id !== sucursal!.id!
				);
				await promocionService.altaSucursales(
					promocion.id!,
					filteredSucursales
				);
				handleCloseAlertAltaSucursal();
				onShowSuccess("Artículo dado de alta con éxito.");
			}
		} catch (e: any) {
			onShowError("Error al dar de alta artículo: " + e);
		}
	};

	return (
		<>
			<Accordion sx={{ width: "100%" }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Stack direction="row" spacing={3} alignItems="center" padding={1}>
						<Typography sx={{ fontSize: "18px" }}>
							{promocion.denominacion}
						</Typography>
						<Chip label={`$${promocion.precioPromocional}`} />
						<Typography variant="h6">
							Desde: {promocion.fechaDesde.toString()}
						</Typography>
						<Typography variant="h6">
							Hasta: {promocion.fechaHasta.toString()}
						</Typography>
					</Stack>

					<ActionButtons
						entity={promocion}
						onEdit={handleOpenEditModal}
						color={
							user!.rol! === "CAJERO" || user!.rol! === "COCINERO"
								? theme.palette.info.light
								: theme.palette.primary.main
						}
						onBaja={promocion.baja ? undefined : handleOpenBajaAlert}
						onAlta={promocion.baja ? handleOpenAltaAlert : undefined}
						onAltaSucursales={
							promocion.baja ? undefined : handleOpenAlertAltaSucursal
						}
					/>
				</AccordionSummary>
				<Stack padding={"12px 24px"} spacing={4} direction="row">
					{promocion.imagenes && promocion.imagenes.length > 0 && (
						<Carousel autoPlay={true} showThumbs={false}>
							{promocion.imagenes.map((imagen, index) => (
								<Stack key={index} spacing={2} width="100%" height="140px">
									<img
										src={imagen.url}
										alt={`Preview ${index + 1}`}
										style={{
											height: "120px",
											width: "100%",
											objectFit: "contain",
										}}
									/>
								</Stack>
							))}
						</Carousel>
					)}
					<Stack spacing={1.5}>
						<Typography>{promocion.descripcionDescuento}</Typography>
						<Stack spacing={2} direction="row">
							<Typography variant="h6">Desde: {promocion.horaDesde.substring(0,5)}</Typography>
							<Typography variant="h6">Hasta: {promocion.horaHasta.substring(0,5)}</Typography>
						</Stack>
						<Stack spacing={2} direction="row">
							{promocion.promocionDetalles &&
								promocion.promocionDetalles.map((detalle) => (
									<Chip
										color="primary"
										label={`${detalle.cantidad}  ${
											detalle.articulo!.denominacion
										}`}
									/>
								))}
						</Stack>
					</Stack>
				</Stack>
			</Accordion>
			<GenericModal
				title={`Editar promoción`}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseEditModal}
			>
				<PromocionForm
					initialPromocion={promocion}
					onClose={handleCloseEditModal}
					onShowSuccess={onShowSuccess}
					onShowError={onShowError}
				/>
			</GenericModal>

			<GenericModal
				title={"Dar de alta promoción"}
				icon={<StoreIcon fontSize="large" />}
				open={showAlertAltaSucursal}
				handleClose={handleCloseAlertAltaSucursal}
			>
				<SucursalesSelector
					selected={promocion && promocion.sucursal ? [promocion.sucursal] : []}
					handleSubmit={handleAltaSucursal}
					buttonTitle={"Dar de alta en sucursales"}
				/>
			</GenericModal>

			<AlertDialog
				open={showBajaAlert}
				title={"¿Estás seguro de que querés dar de baja la promoción?"}
				content={"La promoción se dará de baja sólo en esta sucursal."}
				onAgreeClose={handleBaja}
				onDisagreeClose={handleCloseBajaAlert}
			/>
			<AlertDialog
				open={showAltaAlert}
				title={"¿Estás seguro de que querés dar de alta la promoción?"}
				content={""}
				onAgreeClose={handleAlta}
				onDisagreeClose={handleCloseAltaAlert}
			/>
		</>
	);
};
