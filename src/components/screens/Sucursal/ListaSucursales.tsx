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
import { useState } from "react";


export const ListaSucursales = () => {
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);
	const [showModal, setShowModal] = useState(false);

	const onOpenModal = () => setShowModal(true);
	const onCloseModal = () => setShowModal(false);

	return (
		<Stack
			className="SucursalesContainer"
			height="100%"
			justifyContent="center"
			sx={{ alignItems: "center" }}
		>
			<Typography variant="h1" textAlign="center">
				¿Qué sucursal querés ver?
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
					sucursales.map((sucursal, index) => (
						<SucursalCard key={index} sucursal={sucursal} />
					))}
				<AddCard onClick={onOpenModal}>
					<CardHeader title="Agregar" subheader="Nueva sucursal" />
					<AddCardActions>
						<AddIconButton>
							<AddIcon fontSize="large" />
						</AddIconButton>
					</AddCardActions>
				</AddCard>
				<GenericModal
					title={"Crear sucursal"}
					icon={<StoreIcon fontSize="large" />}
					open={showModal}
					handleClose={onCloseModal}
				>
					<>Formulario sucursal</>
				</GenericModal>
			</Stack>
		</Stack>
	);
};
