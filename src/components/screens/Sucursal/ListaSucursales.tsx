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

export const ListaSucursales = () => {
	const sucursales = useAppSelector((state) => state.selectedData.sucursalesEmpresa);

	return (
		<Stack
			className="SucursalesContainer"
			height="100%" justifyContent="center"
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
				<AddCard>
					<CardHeader title="Agregar" subheader="Nueva sucursal" />
					<AddCardActions>
						<AddIconButton>
							<AddIcon fontSize="large" />
						</AddIconButton>
					</AddCardActions>
				</AddCard>
			</Stack>
		</Stack>
	);
};
