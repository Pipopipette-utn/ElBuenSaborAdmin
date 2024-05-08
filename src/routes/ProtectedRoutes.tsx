import { Route, Routes } from "react-router-dom";
import { Home } from "../components/screens/Home/Home";
import { AppMenu } from "../components/ui/Menu/AppMenu";
import { Box } from "@mui/material";
import { ListaEmpresas } from "../components/screens/Empresa/ListaEmpresas";
import { ListaSucursales } from "../components/screens/Sucursal/ListaSucursales";
import { Sucursales } from "../components/screens/Sucursal/Sucursales";
import { Categorias } from "../components/screens/Categoria/Categorias";
import { ArticulosInsumos } from "../components/screens/Articulos/ArticulosInsumos";
import { ArticulosManufacturados } from "../components/screens/Articulos/ArticulosManufacturados";
export const ProtectedRoutes = () => {
	return (
		<>
			<AppMenu />
			<Box
				className="ContentContainer"
				alignItems="center"
				display="flex"
				flexDirection="column"
				flexGrow={1}
				height="100%"
				mt={8}
			>
				<Routes>
					<Route path="/" element={<ListaEmpresas />} />
					<Route path="/empresas" element={<ListaEmpresas />} />
					<Route path="/empresas/sucursales" element={<ListaSucursales />} />
					<Route path="/inicio" element={<Home />} />
					<Route path="/sucursales" element={<Sucursales />} />
					<Route path="/categorias" element={<Categorias />} />
					<Route path="/articulos/insumos" element={<ArticulosInsumos />} />
					<Route
						path="/articulos/manufacturados"
						element={<ArticulosManufacturados />}
					/>
				</Routes>
			</Box>
		</>
	);
};
