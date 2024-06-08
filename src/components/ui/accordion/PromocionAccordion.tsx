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
import { useAppDispatch } from "../../../redux/hooks";

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
	const [showModal, setShowModal] = useState(false);
	const [showBajaAlert, setShowBajaAlert] = useState(false);

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

	const handleBaja = async () => {
		try {
			const promocionService = new PromocionService(
				"/promociones"
			);
			await promocionService.delete(promocion.id!);
			const newPromo = { ...promocion!, baja: false };
			dispatch(editPromocionesSucursal(newPromo));
			handleCloseBajaAlert();
			onShowSuccess("Artículo dado de baja con éxito");
		} catch (e: any) {
			onShowError("Error al dar de baja artículo: " + e);
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
						color={theme.palette.primary.main}
						onBaja={handleOpenBajaAlert}
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
							<Typography variant="h6">Desde: {promocion.horaDesde}</Typography>
							<Typography variant="h6">Hasta: {promocion.horaHasta}</Typography>
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

			<AlertDialog
				open={showBajaAlert}
				title={"¿Estás seguro de que querés dar de baja la promoción?"}
				content={"La promoción se dará de baja sólo en esta sucursal."}
				onAgreeClose={handleBaja}
				onDisagreeClose={handleCloseBajaAlert}
			/>
		</>
	);
};
