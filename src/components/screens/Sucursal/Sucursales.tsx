import { Box, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "../../../redux/hooks";
import SucursalCard from "./SucursalCard";
import {
	AddCard,
	AddCardActions,
	AddIconButton,
	CardHeader,
} from "../../ui/styled/StyledCard";

export const Sucursales = () => {
	const sucursales = useAppSelector((state) => state.business.sucursalesEmpresa);

	return (
		<Box
			className="EmpresasContainer"
			sx={{ alignItems: "center", paddingY: "10px" }}
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
		</Box>
	);
};
