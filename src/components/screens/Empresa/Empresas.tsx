import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IEmpresa } from "../../../types/empresa";
import EmpresaCard from "./EmpresaCard";

export const Empresas = () => {
	const [empresas, setEmpresas] = useState<IEmpresa[]>([]);

	useEffect(() => {
		const traerEmpresas = async () => {
			const response = await fetch("/empresas.json");
			const empresasData = await response.json();
			setEmpresas(empresasData.empresas as IEmpresa[]);
		};
		traerEmpresas();
	}, []);

	return (
		<Box sx={{ alignItems: "center", paddingY: "32px" }}>
			<Typography variant="h1">¿Qué empresa querés ver?</Typography>
			<Stack
				direction="row"
				sx={{ width:"100%", justifyContent: "center", mt: "32px", flexWrap: "wrap" }}
			>
				{empresas.map((empresa) => (
					<EmpresaCard empresa={empresa} />
				))}
			</Stack>
		</Box>
	);
};
