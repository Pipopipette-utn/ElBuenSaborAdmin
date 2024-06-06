import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { SucursalService } from "./services/SucursalService";
import {
	setCategoriasSucursal,
	setInsumosSucursal,
	setManufacturadosSucursal,
	setPromocionesSucursal,
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
//INICIAR: json-server --watch public/db.json
//http://localhost:3000/

export const App: FC = () => {
	const dispatch = useAppDispatch();

	//const usuarioService = new UsuarioService("/usuario");
	const empresaService = new EmpresaService("/empresas");
	const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
	const sucursalService = new SucursalService("/sucursales");
	const insumoService = new ArticuloInsumoService("/articulosInsumos");
	const manufacturadoService = new ArticuloManufacturadoService(
		"/articulosManufacturados"
	);

	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	useEffect(() => {
		const traerEmpresas = async () => {
			//const usuarios = await usuarioService.getAll();
			//dispatch(setUsuarios(usuarios));
			try {
				dispatch(setEmpresas("loading"));
				const empresas = await empresaService.getAll();
				dispatch(setEmpresas(empresas));
			} catch (e) {
				dispatch(setEmpresas(null));
			}

			try {
				dispatch(setUnidadMedidas("loading"));
				const unidadMedidas = await unidadMedidaService.getAll();
				dispatch(setUnidadMedidas(unidadMedidas));
			} catch (e) {
				dispatch(setUnidadMedidas(null));
			}
		};

		traerEmpresas();
	}, []);

	useEffect(() => {
		const traerSucursales = async () => {
			dispatch(setSucursalesEmpresa(null));
			dispatch(setSelectedSucursal(null));
			if (empresa) {
				try {
					dispatch(setSucursalesEmpresa("loading"));
					const sucursalesFiltradas = await sucursalService.getAllByEmpresa(
						empresa.id!
					);
					dispatch(setSucursalesEmpresa(sucursalesFiltradas));
					if (sucursalesFiltradas && sucursalesFiltradas.length > 0)
						dispatch(setSelectedSucursal(sucursalesFiltradas[0]));
				} catch (e) {
					dispatch(setUnidadMedidas(null));
					dispatch(setSelectedSucursal(null));
				}
			}
		};

		traerSucursales();
	}, [empresa]);

	useEffect(() => {
		dispatch(setCategoriasSucursal(null));
		dispatch(setPromocionesSucursal(null));
		dispatch(setInsumosSucursal(null));
		dispatch(setManufacturadosSucursal(null));

		const traerDatosSucursal = async () => {
			if (empresa && sucursal) {
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
		traerDatosSucursal();
	}, [sucursal]);

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
