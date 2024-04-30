import { Stack, Typography } from "@mui/material";
import EmpresaCard from "./EmpresaCard";
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../../styles/theme";
import { AddCard, AddCardActions, AddIconButton, CardHeader } from "../../ui/styled/StyledCard";
import { useAppSelector } from "../../../redux/hooks";

export const Empresas = () => {
	const empresas = useAppSelector((state) => state.business.empresas);

	return (
		<>
			<Typography variant="h1" textAlign="center">
				¿Qué empresa querés usar?
			</Typography>
			<Stack
				direction="row"
				sx={{
					justifyContent: "center",
					mt: "32px",
					flexWrap: "wrap",
				}}
			>
				{empresas &&
					empresas.map((empresa, index) => (
						<EmpresaCard key={index} empresa={empresa} />
					))}
				<AddCard sx={{ border: `2px dashed ${theme.palette.info.light}` }}>
					<CardHeader title="Agregar" subheader="Nueva empresa" />
					<AddCardActions>
						<AddIconButton>
							<AddIcon fontSize="large" />
						</AddIconButton>
					</AddCardActions>
				</AddCard>
			</Stack>
		</>
	);
};
