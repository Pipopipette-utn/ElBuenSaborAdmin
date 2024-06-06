import { LinearProgress, Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import SucursalCardDetails from "../../ui/cards/SucursalCardDetails";
import { useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import StoreIcon from "@mui/icons-material/Store";
import { SucursalForm } from "../../ui/forms/SucursalForm";
import { emptySucursal } from "../../../types/emptyEntities";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";

export const Sucursales = () => {
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
