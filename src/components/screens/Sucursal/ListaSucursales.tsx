import { Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "../../../redux/hooks";
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

export const ListaSucursales = () => {
	const navigate = useNavigate();

	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);

	useEffect(() => {
		if (!empresa) {
			navigate("/empresas");
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
				{sucursales && sucursales !== "loading" &&
					sucursales.map((sucursal, index) => (
						<SucursalCard key={index} sucursal={sucursal} />
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
				<GenericModal
					title={`Crear sucursal para ${empresa?.nombre}`}
					icon={<StoreIcon fontSize="large" />}
					open={showModal}
					handleClose={handleCloseModal}
				>
					<SucursalForm
						initialSucursal={emptySucursal}
						onClose={handleCloseModal}
					/>
				</GenericModal>
			</Stack>
		</Stack>
	);
};
