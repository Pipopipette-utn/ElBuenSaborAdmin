import { LinearProgress, Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import SucursalCardDetails from "../../ui/cards/SucursalCardDetails";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import StoreIcon from "@mui/icons-material/Store";
import { SucursalForm } from "../../ui/forms/SucursalForm";
import { emptySucursal } from "../../../types/emptyEntities";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { PaisService } from "../../../services/PaisService";
import { ProvinciaService } from "../../../services/ProvinciaService";
import { LocalidadService } from "../../../services/LocalidadService";
import { setLocalidades, setPaises, setProvincias } from "../../../redux/slices/Location";

export const Sucursales = () => {
	const dispatch = useAppDispatch();
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

	useEffect(() => {
		const paisService = new PaisService("/paises");
		const provinciaService = new ProvinciaService("/provincias");
		const localidadService = new LocalidadService("/localidades");

		console.log("entre");

		const traerUbicacion = async () => {
			const todosPaises = await paisService.getAll();
			const todasProvincias = await provinciaService.getAll();
			const todasLocalidades = await localidadService.getAll();

			console.log(todosPaises);
			dispatch(setPaises(todosPaises));
			dispatch(setProvincias(todasProvincias));
			dispatch(setLocalidades(todasLocalidades));
		};

		traerUbicacion();
	}, []);

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
					quantity={sucursales?.length ?? 0}
					activeEntities={"Sucursales activas"}
					buttonText={"Nueva sucursal"}
					onClick={handleOpenModal}
				/>
				<>
					<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
						Todas las sucursales
					</Typography>
					<Stack direction="row" sx={{ flexWrap: "wrap", overflowY: "auto" }}>
						{sucursales &&
							sucursales !== "loading" &&
							sucursales.map((sucursal, index) => (
								<SucursalCardDetails
									sucursal={sucursal}
									key={index}
									onShowSuccess={handleShowSuccess}
									onShowError={handleShowError}
								/>
							))}
					</Stack>
					{sucursales === "loading" && (
						<LinearProgress sx={{ width: "100%" }} />
					)}
				</>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear sucursal"}
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
		</>
	);
};
