import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../components/screens/Home/Home";
import { AppMenu } from "../components/ui/Menu/AppMenu";
import { Box, CircularProgress, Stack } from "@mui/material";
import ListaEmpresas from "../components/screens/Empresa/ListaEmpresas";
import ListaSucursales from "../components/screens/Sucursal/ListaSucursales";
import Sucursales from "../components/screens/Sucursal/Sucursales";
import Categorias from "../components/screens/Categoria/Categorias";
import ArticulosInsumos from "../components/screens/Articulos/ArticulosInsumos";
import ArticulosManufacturados from "../components/screens/Articulos/ArticulosManufacturados";
import SelectArticulo from "../components/screens/Articulos/SelectArticulo";
import UnidadesMedida from "../components/screens/UnidadMedida/UnidadesMedida";
import Promociones from "../components/screens/Promociones/Promociones";
import Empleados from "../components/screens/Empleados/Empleados";
import PrivateRoute from "./ProtectedRoute";
import { useAppSelector } from "../redux/hooks";
import Pedidos from "../components/screens/Pedidos/Pedidos";
import { useEffect } from "react";

const ProtectedRoutes = () => {
	const user = useAppSelector((state) => state.auth.user);
	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const navigate = useNavigate();

	useEffect(() => {
		if (!empresa) {
			navigate("/");
		}else if (!sucursal){
			navigate("/empresas/sucursales");
		}
	}, []);

	return (
		<>
			{!user ? (
				<Stack
					width="100vw"
					height="100vh"
					alignItems="center"
					justifyContent="center"
				>
					<CircularProgress />
				</Stack>
			) : (
				<>
					<AppMenu />
					<Box
						className="ContentContainer"
						alignItems="center"
						display="flex"
						flexDirection="column"
						flexGrow={1}
						minHeight="100%"
						sx={{ mt: { mobile: 8, xs: 7, sm: 8 } }}
					>
						{user ? (
							<Routes>
								<Route
									path="/"
									element={
										user?.rol === "SUPERADMIN" ? (
											<PrivateRoute
												component={ListaEmpresas}
												roles={["SUPERADMIN"]}
											/>
										) : user?.rol === "ADMIN" ? (
											<PrivateRoute
												component={ListaSucursales}
												roles={["ADMIN"]}
											/>
										) : (
											<PrivateRoute
												component={Home}
												roles={["COCINERO", "DELIVERY", "CAJERO"]}
											/>
										)
									}
								/>
								<Route
									path="/empresas"
									element={
										<PrivateRoute
											component={ListaEmpresas}
											roles={["SUPERADMIN"]}
										/>
									}
								/>
								<Route
									path="/empresas/sucursales"
									element={
										<PrivateRoute
											component={ListaSucursales}
											roles={["SUPERADMIN", "ADMIN"]}
										/>
									}
								/>
								<Route path="/inicio" element={<Home />} />
								<Route
									path="/sucursales"
									element={
										<PrivateRoute
											component={Sucursales}
											roles={["SUPERADMIN", "ADMIN"]}
										/>
									}
								/>
								<Route
									path="/categorias"
									element={
										<PrivateRoute
											component={Categorias}
											roles={["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"]}
										/>
									}
								/>
								<Route
									path="/articulos"
									element={
										<PrivateRoute
											component={SelectArticulo}
											roles={["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"]}
										/>
									}
								/>
								<Route
									path="/articulos/insumos"
									element={
										<PrivateRoute
											component={ArticulosInsumos}
											roles={["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"]}
										/>
									}
								/>
								<Route
									path="/articulos/manufacturados"
									element={
										<PrivateRoute
											component={ArticulosManufacturados}
											roles={["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"]}
										/>
									}
								/>
								<Route
									path="/unidades-de-medida"
									element={
										<PrivateRoute
											component={UnidadesMedida}
											roles={["SUPERADMIN", "ADMIN", "COCINERO"]}
										/>
									}
								/>
								<Route
									path="/promociones"
									element={
										<PrivateRoute
											component={Promociones}
											roles={["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"]}
										/>
									}
								/>
								<Route
									path="/empleados"
									element={
										<PrivateRoute
											component={Empleados}
											roles={["SUPERADMIN", "ADMIN"]}
										/>
									}
								/>
								<Route
									path="/pedidos"
									element={
										<PrivateRoute
											component={Pedidos}
											roles={["SUPERADMIN", "ADMIN", "CAJERO", "DELIVERY"]}
										/>
									}
								/>
							</Routes>
						) : (
							<>redirecting...</>
						)}
					</Box>
				</>
			)}
		</>
	);
};

export default ProtectedRoutes;
