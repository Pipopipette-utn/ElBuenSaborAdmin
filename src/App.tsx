import { Box } from "@mui/material";
import { AppRouter } from "./routes/AppRouter";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
	setEmpresas,
	setSucursal,
	setSucursales,
	setSucursalesEmpresa,
} from "./redux/slices/Business";
import { ISucursal, ISucursalBD } from "./types/empresa";
import { filtrarSucursales } from "./services/filter";
//INICIAR: json-server --watch public/db.json
//http://localhost:3000/

export const App: FC = () => {
	const dispatch = useAppDispatch();
	const empresa = useAppSelector((state) => state.business.empresa);
	const empresas = useAppSelector((state) => state.business.empresas);
	const sucursales = useAppSelector((state) => state.business.sucursales);

	useEffect(() => {
		const traerEmpresas = async () => {
			const response = await fetch("http://localhost:3000/empresas");
			const empresasData = await response.json();
			dispatch(setEmpresas(empresasData));
		};
		traerEmpresas();
	}, []);

	useEffect(() => {
		const traerSucursales = async () => {
			const response = await fetch("http://localhost:3000/sucursales");
			const sucursalesData = await response.json();
			const sucursalesMapeadas: ISucursal[] = sucursalesData.map(
				(sucursal: ISucursalBD) => {
					const empresa = empresas?.find((e) => e.id == sucursal.empresa_id);
					return { ...sucursal, empresa };
				}
			);
			dispatch(setSucursales(sucursalesMapeadas));
		};
		traerSucursales();
	}, [empresas]);

	useEffect(() => {
		const sucursalesFiltradas = empresa
			? filtrarSucursales(sucursales ?? [], empresa)
			: [];

		dispatch(setSucursalesEmpresa(sucursalesFiltradas));
		dispatch(setSucursal(sucursalesFiltradas[0] ?? null));
	}, [empresa]);

	return (
		<Box
			className="MainContainer"
			sx={{
				maxWidth: "100vw",
				width: "auto",
				minHeight: "100vh",
				height: "auto",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<AppRouter />
		</Box>
	);
};

export default App;
