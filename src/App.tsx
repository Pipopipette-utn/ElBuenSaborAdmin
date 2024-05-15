import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { EmpresaService } from "./services/EmpresaService";
import { SucursalService } from "./services/SucursalService";
import {
	setSucursal,
	setSucursalesEmpresa,
} from "./redux/slices/SelectedData";
import { DomicilioService } from "./services/DomicilioService";
import { PaisService } from "./services/PaisService";
import { ProvinciaService } from "./services/ProvinciaService";
import { LocalidadService } from "./services/LocalidadService";
import {
	setDomicilios,
	setLocalidades,
	setPaises,
	setProvincias,
} from "./redux/slices/Location";
import { Box } from "@mui/material";
import { AppRouter } from "./routes/AppRouter";
import { setEmpresas, setSucursales } from "./redux/slices/Business";
//INICIAR: json-server --watch public/db.json
//http://localhost:3000/

export const App: FC = () => {
	const dispatch = useAppDispatch();
	const paisService = new PaisService("/pais");
	const provinciaService = new ProvinciaService("/provincia");
	const localidadService = new LocalidadService("/localidad");
	const domicilioService = new DomicilioService("/domicilios");
	//const usuarioService = new UsuarioService("/usuario");
	//const unidadMedidaService = new UnidadMedidaService("/unidadMedida");
	const empresaService = new EmpresaService("/empresa");
	const sucursalService = new SucursalService("/sucursal");
	//const categoriaService = new CategoriaService("/categorias");
	//const articuloService = new ArticuloService("/articulo");
	//const articuloInsumoService = new ArticuloInsumoService("/articuloInsumo");
	//const articuloManufacturadoService = new ArticuloManufacturadoService("/articuloManufacturado");

	const sucursales = useAppSelector((state) => state.business.sucursales);
	//const categorias = useAppSelector((state) => state.business.categorias);

	const empresa = useAppSelector((state) => state.selectedData.empresa);
	//const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	useEffect(() => {
		const traerEmpresas = async () => {
			const paises = await paisService.getAll();
			const provincias = await provinciaService.getAll();
			const localidades = await localidadService.getAll();
			const domicilios = await domicilioService.getAll();
			dispatch(setPaises(paises));
			dispatch(setProvincias(provincias));
			dispatch(setLocalidades(localidades));
			dispatch(setDomicilios(domicilios));

			//const usuarios = await usuarioService.getAll();
			//dispatch(setUsuarios(usuarios));

			//const unidadMedidas = await unidadMedidaService.getAll();
			//dispatch(setUnidadMedidas(unidadMedidas));

			const empresasData = await empresaService.getAll();
			dispatch(setEmpresas(empresasData));

			//const categoriasData = await categoriaService.getAll();
			//const categoriasMapeadas = categoriaService.mapCategorias(categoriasData);
			//dispatch(setCategorias(categoriasMapeadas));

			const sucursales = await sucursalService.getAll();
			dispatch(setSucursales(sucursales));

			/*const articulos = await articuloService.getAll();

			const articulosInsumos = await articuloInsumoService.getAll();
			const articulosInsumosMapeados = articuloService.mapArticulos(
				articulosInsumos,
				articulos,
				unidadMedidas,
				categoriasData
			);
			dispatch(
				setArticulosInsumos(articulosInsumosMapeados as IArticuloInsumo[])
			);

			const articulosManufacturados =
				await articuloManufacturadoService.getAll();
			const articulosManufacturadosMapeados = articuloService.mapArticulos(
				articulosManufacturados,
				articulos,
				unidadMedidas,
				categoriasData
			);
			dispatch(
				setArticulosManufacturados(
					articulosManufacturadosMapeados as IArticuloManufacturado[]
				)
			);*/
		};

		traerEmpresas();
	}, []);

	useEffect(() => {
		const sucursalesFiltradas =
			empresa && empresa.id
				? sucursalService.filterByEmpresaId(sucursales ?? [], empresa.id)
				: [];

		dispatch(setSucursalesEmpresa(sucursalesFiltradas));
		dispatch(setSucursal(sucursalesFiltradas[0] ?? null));
	}, [empresa]);

	/*
	useEffect(() => {
		const filtrarCategorias = async () => {
			const categoriaSucursal = sucursal
				? await categoriaService.filterBySucursal(categorias ?? [], sucursal.id)
				: [];

			dispatch(setCategoriasSucursal(categoriaSucursal));
		};
		filtrarCategorias();
	}, [sucursal]);
*/

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
