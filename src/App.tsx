import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { SucursalService } from "./services/SucursalService";
import {
	setCategoriasSucursal,
	setEmpresa,
	setInsumosSucursal,
	setManufacturadosSucursal,
	setSelectedSucursal,
	setSucursalesEmpresa,
} from "./redux/slices/SelectedData";
import { Box } from "@mui/material";
import { AppRouter } from "./routes/AppRouter";
import {
	setArticulosInsumos,
	setArticulosManufacturados,
	setEmpresas,
	setUnidadMedidas,
} from "./redux/slices/Business";
import { UnidadMedidaService } from "./services/UnidadMedidaService";
import { EmpresaService } from "./services/EmpresaService";
import { ArticuloInsumoService } from "./services/ArticuloInsumoService";
import { ArticuloManufacturadoService } from "./services/ArticuloManufacturadoService";
import { useAuth0 } from "@auth0/auth0-react";
import { login, setEmpleado, setUser } from "./redux/slices/Auth";
import { callApi } from "./components/auth0/callApi";
import { UsuarioService } from "./services/UsuarioService";
import { EmpleadoService } from "./services/EmpleadoService";
import ArticulosManufacturados from "./components/screens/Articulos/ArticulosManufacturados";
//INICIAR: json-server --watch public/db.json
//http://localhost:3000/

export const App: FC = () => {
	const empresaService = new EmpresaService("/empresas");
	const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
	const sucursalService = new SucursalService("/sucursales");
	const insumoService = new ArticuloInsumoService("/articulosInsumos");
	const manufacturadoService = new ArticuloManufacturadoService(
		"/articulosManufacturados"
	);
	const usuarioService = new UsuarioService("/usuarios");
	const empleadoService = new EmpleadoService("/empleados");
	const dispatch = useAppDispatch();
	const {
		isAuthenticated,
		getAccessTokenSilently,
		user: userAuth0,
	} = useAuth0();

	const user = useAppSelector((state) => state.auth.user);
	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const articulosInsumosSucursal = useAppSelector(
		(state) => state.selectedData.articulosInsumosSucursal
	);
	const articulosManufacturadosSucursal = useAppSelector(
		(state) => state.selectedData.articulosManufacturadosSucursal
	);

	const getToken = async () => {
		const token = await callApi(getAccessTokenSilently);
		localStorage.setItem("token", token);
	};

	useEffect(() => {
		const obtenerUsuario = async () => {
			const usuario = await usuarioService.getUsuarioByMail(userAuth0!.email!);
			if (usuario.rol !== "SUPERADMIN") {
				const empleado = await empleadoService.getEmpleadoByMail(
					userAuth0!.email!
				);
				if (empleado) {
					dispatch(setEmpleado(empleado));
					const sucursal = await sucursalService.getById(
						empleado.sucursal!.id!
					);
					dispatch(setSelectedSucursal(sucursal));
					const selectedEmpresa = await sucursalService.getEmpresa(
						sucursal!.id!
					);
					dispatch(setEmpresa(selectedEmpresa));
				}
			}
			dispatch(setUser(usuario));
			dispatch(login());
		};
		if (isAuthenticated) {
			getToken();
			obtenerUsuario();
		}
	}, [isAuthenticated]);

	useEffect(() => {
		const traerEmpresas = async () => {
			if (user!.rol === "SUPERADMIN") {
				try {
					dispatch(setEmpresas("loading"));
					const empresas = await empresaService.getAll();
					dispatch(setEmpresas(empresas));
				} catch (e) {
					dispatch(setEmpresas(null));
				}
			}
			if (user && ["SUPERADMIN", "ADMIN", "COCINERO"].includes(user!.rol!)) {
				try {
					dispatch(setUnidadMedidas("loading"));
					const unidadMedidas = await unidadMedidaService.getAll();
					dispatch(setUnidadMedidas(unidadMedidas));
				} catch (e) {
					dispatch(setUnidadMedidas(null));
				}
			}
		};
		if (user) traerEmpresas();
	}, [user]);

	useEffect(() => {
		const traerSucursales = async () => {
			if (empresa && user && ["SUPERADMIN", "ADMIN"].includes(user!.rol!)) {
				dispatch(setSucursalesEmpresa(null));
				try {
					dispatch(setSucursalesEmpresa("loading"));
					const sucursalesFiltradas = await sucursalService.getAllByEmpresa(
						empresa.id!
					);
					dispatch(
						setSucursalesEmpresa(sucursalesFiltradas.filter((s) => !s.baja))
					);
					if (sucursalesFiltradas && sucursalesFiltradas.length > 0)
						dispatch(setSelectedSucursal(sucursalesFiltradas[0]));
					else dispatch(setSelectedSucursal(null));
				} catch (e) {
					dispatch(setUnidadMedidas(null));
					dispatch(setSelectedSucursal(null));
				}
			}
		};

		if (user) traerSucursales();
	}, [empresa, user]);

	useEffect(() => {
		dispatch(setCategoriasSucursal(null));
		dispatch(setInsumosSucursal(null));
		dispatch(setManufacturadosSucursal(null));

		const traerDatosSucursal = async () => {
			if (
				empresa &&
				sucursal &&
				["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"].includes(user!.rol!)
			) {
				try {
					dispatch(setCategoriasSucursal("loading"));
					const categorias =
						(await sucursalService.getCategorias(sucursal.id!)) ?? [];
					dispatch(setCategoriasSucursal(categorias));
				} catch (e) {
					dispatch(setCategoriasSucursal(null));
				}

				try {
					const articulosInsumos =
						(await insumoService.getAllActiveBySucursal(sucursal.id!)) ?? [];
					dispatch(setArticulosInsumos(articulosInsumos));
				} catch (e) {
					dispatch(setArticulosInsumos(null));
				}

				try {
					const articulosManufacturados =
						(await manufacturadoService.getAllActiveBySucursal(sucursal.id!)) ??
						[];
					dispatch(setArticulosManufacturados(articulosManufacturados));
				} catch (e) {
					dispatch(setArticulosManufacturados(null));
				}
			}
		};
		if (user) traerDatosSucursal();
	}, [sucursal, user]);

	useEffect(() => {
		const traerDatosSucursal = async () => {
			if (
				empresa &&
				sucursal &&
				["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"].includes(user!.rol!)
			) {
				try {
					const articulosInsumos =
						(await insumoService.getAllActiveBySucursal(sucursal.id!)) ?? [];
					dispatch(setArticulosInsumos(articulosInsumos));
				} catch (e) {
					dispatch(setArticulosInsumos(null));
				}
			}
		};
		if (user) traerDatosSucursal();
	}, [articulosInsumosSucursal]);

	useEffect(() => {
		const traerDatosSucursal = async () => {
			if (
				empresa &&
				sucursal &&
				["SUPERADMIN", "ADMIN", "COCINERO", "CAJERO"].includes(user!.rol!)
			) {
				try {
					const articulosManufacturados =
						(await manufacturadoService.getAllActiveBySucursal(sucursal.id!)) ??
						[];
					dispatch(setArticulosManufacturados(articulosManufacturados));
				} catch (e) {
					dispatch(setArticulosManufacturados(null));
				}
			}
		};
		if (user) traerDatosSucursal();
	}, [articulosManufacturadosSucursal]);

	return (
		<Box
			className="MainContainer"
			sx={{
				maxWidth: "100vw",
				width: "auto",
				minHeight: "100vh",
				maxHeight: "100vh",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<AppRouter />
		</Box>
	);
};

export default App;
