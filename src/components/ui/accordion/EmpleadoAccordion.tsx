import { FC, useState } from "react";
import StoreIcon from "@mui/icons-material/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GenericModal from "../shared/GenericModal";
import { AlertDialog } from "../shared/AlertDialog";
import { Accordion } from "../styled/StyledAccordion";
import { AccordionSummary, Chip, Stack, Typography } from "@mui/material";
import { ActionButtons } from "./AccordionButtons";
import { theme } from "../../../styles/theme";
import { useAppDispatch } from "../../../redux/hooks";
import { IEmpleado } from "../../../types/usuarios";
import { EmpleadoService } from "../../../services/EmpleadoService";
import { editEmpleadoSucursal } from "../../../redux/slices/SelectedData";
import { EmpleadoForm } from "../forms/EmpleadoForm";

interface EmpleadoAccordionProps {
	empleado: IEmpleado;
	onShowSuccess: (m: string) => void;
	onShowError: (m: string) => void;
}

export const EmpleadoAccordion: FC<EmpleadoAccordionProps> = ({
	empleado,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();
	const empleadoService = new EmpleadoService("/empleados");

	const [showModal, setShowModal] = useState(false);
	const [showBajaAlert, setShowBajaAlert] = useState(false);
	const [showAltaAlert, setShowAltaAlert] = useState(false);

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

	const handleBaja = async () => {
		try {
			await empleadoService.delete(empleado.id!);
			const newEmpleado = { ...empleado!, baja: true };
			dispatch(editEmpleadoSucursal(newEmpleado));
			handleCloseBajaAlert();
			onShowSuccess("Empleado dado de baja con éxito");
		} catch (e: any) {
			onShowError("Error al dar de baja empleado: " + e);
		}
	};

	const handleAlta = async () => {
		try {
			await empleadoService.alta(empleado.id!);
			const newEmpleado = { ...empleado!, baja: false };
			dispatch(editEmpleadoSucursal(newEmpleado));
			handleCloseBajaAlert();
			onShowSuccess("Empleado dado de alta con éxito");
		} catch (e: any) {
			onShowError("Error al dar de alta empleado: " + e);
		}
	};

	return (
		<>
			<Accordion
				sx={{
					width: "100%",
					backgroundColor: empleado.baja
						? theme.palette.info.light
						: theme.palette.bg.light,
				}}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Stack direction="row" spacing={3} alignItems="center" padding={1}>
						<Typography sx={{ fontSize: "18px" }}>
							{empleado.nombre} {empleado.apellido}
						</Typography>
						<Typography variant="h6">{empleado.usuario.email}</Typography>
						<Chip
							color={empleado.baja ? "info" : "primary"}
							label={`${empleado.usuario.rol}`}
						/>
					</Stack>

					<ActionButtons
						entity={empleado}
						onEdit={handleOpenEditModal}
						color={
							empleado.baja
								? theme.palette.bg.light
								: theme.palette.primary.main
						}
						onBaja={empleado.baja ? undefined : handleOpenBajaAlert}
						onAlta={empleado.baja ? handleOpenAltaAlert : undefined}
					/>
				</AccordionSummary>
				<Stack
					padding={"12px 24px"}
					spacing={2}
					direction="row"
					alignItems="flex-start"
					justifyContent="flex-start"
				>
					{empleado.imagenPersona && (
						<Stack height="140px">
							<img
								src={empleado.imagenPersona.url}
								style={{
									height: "120px",
									width: "100%",
								}}
							/>
						</Stack>
					)}
					<Stack spacing={1} direction="column">
						<Typography variant="h6">
							Nombre de usuario: {empleado.usuario.username}
						</Typography>
						<Typography variant="h6">Teléfono: {empleado.telefono}</Typography>
						<Typography variant="h6">
							Fecha de nacimiento: {empleado.fechaNacimiento.toString()}
						</Typography>
					</Stack>
				</Stack>
			</Accordion>
			<GenericModal
				title={`Editar empleado`}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseEditModal}
			>
				<EmpleadoForm
					initialEmpleado={empleado}
					onClose={handleCloseEditModal}
					onShowSuccess={onShowSuccess}
					onShowError={onShowError}
				/>
			</GenericModal>

			<AlertDialog
				open={showBajaAlert}
				title={"¿Estás seguro de que querés dar de baja el empleado?"}
				onAgreeClose={handleBaja}
				onDisagreeClose={handleCloseBajaAlert}
			/>
			<AlertDialog
				open={showAltaAlert}
				title={"¿Estás seguro de que querés dar de alta el empleado?"}
				content={""}
				onAgreeClose={handleAlta}
				onDisagreeClose={handleCloseAltaAlert}
			/>
		</>
	);
};
