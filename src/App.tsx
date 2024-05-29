import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { EmpresaService } from "./services/EmpresaService";
import { SucursalService } from "./services/SucursalService";
import {
	setCategoriasSucursal,
	setPromocionesSucursal,
	setSucursal,
	setSucursalesEmpresa,
} from "./redux/slices/SelectedData";
import { PaisService } from "./services/PaisService";
import { ProvinciaService } from "./services/ProvinciaService";
import { LocalidadService } from "./services/LocalidadService";
import {
	setLocalidades,
	setPaises,
	setProvincias,
} from "./redux/slices/Location";
import { Box } from "@mui/material";
import { AppRouter } from "./routes/AppRouter";
import {
	setEmpresas,
	setInsumos,
	setManufacturados,
	setSucursales,
	setUnidadMedidas,
} from "./redux/slices/Business";
import { UnidadMedidaService } from "./services/UnidadMedidaService";
import { ArticuloInsumoService } from "./services/ArticuloInsumoService";
import { ArticuloManufacturadoService } from "./services/ArticuloManufacturadoService";
import { PromocionService } from "./services/PromocionService";
//INICIAR: json-server --watch public/db.json
//http://localhost:3000/

export const App: FC = () => {
	const dispatch = useAppDispatch();
	const paisService = new PaisService("/paises");
	const provinciaService = new ProvinciaService("/provincias");
	const localidadService = new LocalidadService("/localidades");
	//const usuarioService = new UsuarioService("/usuario");
	const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
	const empresaService = new EmpresaService("/empresas");
	const sucursalService = new SucursalService("/sucursales");
	const promocionService = new PromocionService("/promociones");
	const articuloInsumoService = new ArticuloInsumoService("/articulosInsumos");
	const articuloManufacturadoService = new ArticuloManufacturadoService(
		"/articulosManufacturados"
	);

	const sucursales = useAppSelector((state) => state.business.sucursales);
	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	useEffect(() => {
		const traerEmpresas = async () => {
			const paises = await paisService.getAll();
			const provincias = await provinciaService.getAll();
			const localidades = await localidadService.getAll();
			dispatch(setPaises(paises));
			dispatch(setProvincias(provincias));
			dispatch(setLocalidades(localidades));

			//const usuarios = await usuarioService.getAll();
			//dispatch(setUsuarios(usuarios));

			const unidadMedidas = await unidadMedidaService.getAll();
			dispatch(setUnidadMedidas(unidadMedidas));

			const empresasData = await empresaService.getAll();
			dispatch(setEmpresas(empresasData));

			const sucursales = await sucursalService.getAll();
			dispatch(setSucursales(sucursales));

			const articulosInsumos = await articuloInsumoService.getAll();
			dispatch(setInsumos(articulosInsumos));

			const articulosManufacturados =
				await articuloManufacturadoService.getAll();

			dispatch(setManufacturados(articulosManufacturados));
		};

		traerEmpresas();
	}, []);

	useEffect(() => {
		if (empresa && sucursales) {
			const sucursalesFiltradas =
				sucursalService.filterByEmpresaId(sucursales!, empresa.id!) ?? [];
			dispatch(setSucursalesEmpresa(sucursalesFiltradas));
			dispatch(setSucursal(sucursalesFiltradas[0] ?? null));
		}
	}, [empresa, sucursales]);

	useEffect(() => {
		dispatch(setCategoriasSucursal(null));
		const filterCategorias = async () => {
			if (sucursal) {
				const categoriasSucursal = sucursalService.getCategorias(sucursal.id!);
				dispatch(setCategoriasSucursal(await categoriasSucursal));
			}
		};

		const findPromociones = async () => {
			if (sucursal) {
				const promociones = await promocionService.getAll();
				const promocionesSucursal = promociones.filter(
					(promocion) =>
						promocion.sucursales.find((p) => p.id === sucursal.id) != undefined
				);
				dispatch(setPromocionesSucursal(promocionesSucursal));
			}
		};
		filterCategorias();
		findPromociones();
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
