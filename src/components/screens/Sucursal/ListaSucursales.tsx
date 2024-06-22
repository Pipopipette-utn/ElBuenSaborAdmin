import { Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
	AddCard,
	AddCardActions,
	AddIconButton,
	CardHeader,
} from "../../ui/styled/StyledCard";
import SucursalCard from "../../ui/cards/SucursalCard";
import GenericModal from "../../ui/shared/GenericModal";
import StoreIcon from "@mui/icons-material/Store";
import { useEffect, useState } from "react";
import { SucursalForm } from "../../ui/forms/SucursalForm";
import { emptySucursal } from "../../../types/emptyEntities";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../ui/shared/Loader";
import { PaisService } from "../../../services/PaisService";
import { ProvinciaService } from "../../../services/ProvinciaService";
import { LocalidadService } from "../../../services/LocalidadService";
import {
	setLocalidades,
	setPaises,
	setProvincias,
} from "../../../redux/slices/Location";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { theme } from "../../../styles/theme";

const ListaSucursales = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const paisService = new PaisService("/paises");
	const provinciaService = new ProvinciaService("/provincias");
	const localidadService = new LocalidadService("/localidades");

	const user = useAppSelector((state) => state.auth.user);
	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

	useEffect(() => {
		if (!empresa && user!.rol != "ADMIN") {
			navigate("/empresas");
		} else {
			const traerUbicacion = async () => {
				const todosPaises = await paisService.getAll();
				const todasProvincias = await provinciaService.getAll();
				const todasLocalidades = await localidadService.getAll();

				dispatch(setPaises(todosPaises));
				dispatch(setProvincias(todasProvincias));
				dispatch(setLocalidades(todasLocalidades));
			};

			traerUbicacion();
		}
	}, []);

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	return (
		<Stack
			className="SucursalesContainer"
			mt="4%"
			justifyContent="center"
			sx={{ alignItems: "center" }}
		>
			<Typography variant="h1" textAlign="center">
				Sucursales de {empresa?.nombre}
			</Typography>
			<Stack
				direction="row"
				sx={{
					width: "100%",
					justifyContent: "center",
					mt: "32px",
					flexWrap: "wrap",
				}}
			>
				{sucursales &&
					sucursales !== "loading" &&
					sucursales.map((sucursal, index) => (
						<SucursalCard
							key={index}
							sucursal={sucursal}
							onShowSuccess={handleShowSuccess}
							onShowError={handleShowError}
						/>
					))}
				<AddCard onClick={handleOpenModal}>
					<CardHeader title="Agregar" subheader="Nueva sucursal" />
					<AddCardActions>
						<AddIconButton>
							<AddIcon fontSize="large" />
						</AddIconButton>
					</AddCardActions>
				</AddCard>
				{sucursales === "loading" && <Loader />}
			</Stack>
			{user!.rol === "SUPERADMIN" && (
				<Button
					variant="text"
					sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
					onClick={() => navigate("/empresas")}
				>
					Volver a las empresas
				</Button>
			)}
			<GenericModal
				title={`Crear sucursal para ${empresa?.nombre}`}
				icon={<StoreIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<SucursalForm
					initialSucursal={emptySucursal}
					onClose={handleCloseModal}
					onShowSuccess={handleShowSuccess}
					onShowError={handleShowError}
				/>
			</GenericModal>
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
		</Stack>
	);
};
export default ListaSucursales;
