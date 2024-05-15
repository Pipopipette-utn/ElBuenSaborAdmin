import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { ContainerStack, StyledStack } from "../../ui/styled/StyledStack";
import { Link } from "react-router-dom";
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LiquorIcon from '@mui/icons-material/Liquor';

const Articulos: React.FC = () => {
	return (
		<ContainerStack>
			<StyledStack
				spacing={3}
				height="100%"
				justifyContent="center"
				alignItems="center"
			>
				<Typography variant="h6">¿Cuál queres elegir?</Typography>
				<Stack spacing={2} width="50%">
					<Link to="/articulos/insumos" style={{ textDecoration: "none" }}>
						<Button fullWidth variant="contained" startIcon={<LiquorIcon />}>
							Artículos Insumos
						</Button>
					</Link>
					<Link
						to="/articulos/manufacturados"
						style={{ textDecoration: "none" }}
					>
						<Button fullWidth variant="contained" startIcon={<LunchDiningIcon />}>
							Artículos Manufacturados
						</Button>
					</Link>
				</Stack>
			</StyledStack>
		</ContainerStack>
	);
};

export default Articulos;
