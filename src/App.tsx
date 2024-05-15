import { Box } from "@mui/material";
import { AppRouter } from "./routes/AppRouter";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
	setArticulosInsumos,
	setArticulosManufacturados,
	setCategorias,
	setEmpresas,
	setSucursales,
	setUnidadMedidas,
	setUsuarios,
} from "./redux/slices/Business";
import { EmpresaService } from "./services/EmpresaService";
import { SucursalService } from "./services/SucursalService";
import {
	setCategoriasSucursal,
	setSucursal,
	setSucursalesEmpresa,
} from "./redux/slices/SelectedData";
import { CategoriaService } from "./services/CategoriaService";
import { ArticuloInsumoService } from "./services/ArticuloInsumoService";
import { ArticuloManufacturadoService } from "./services/ArticuloManufacturadoService";
import { UsuarioService } from "./services/UsuarioService";
import { ArticuloService } from "./services/ArticuloService";
import { UnidadMedidaService } from "./services/UnidadMedidaService";
import { IArticuloInsumo, IArticuloManufacturado } from "./types/empresa";
import { DomicilioService } from "./services/DomicilioService";
import { PaisService } from "./services/PaisService";
import { ProvinciaService } from "./services/ProvinciaService";
import { LocalidadService } from "./services/LocalidadService";
import { setDomicilios, setLocalidades, setPaises, setProvincias } from "./redux/slices/Location";
//INICIAR: json-server --watch public/db.json
//http://localhost:3000/

export const App: FC = () => {
	const dispatch = useAppDispatch();
	const paisService = new PaisService("/paises");
	const provinciaService = new ProvinciaService("/provincias");
	const localidadService = new LocalidadService("/localidades");
	const domicilioService = new DomicilioService("/domicilios");
	const usuarioService = new UsuarioService("/users");
	const unidadMedidaService = new UnidadMedidaService("/unidadMedidas");
	const empresaService = new EmpresaService("/empresas");
	const sucursalService = new SucursalService("/sucursales");
	const categoriaService = new CategoriaService("/categorias");
	const articuloService = new ArticuloService("/articulos");
	const articuloInsumoService = new ArticuloInsumoService("/articulosInsumos");
	const articuloManufacturadoService = new ArticuloManufacturadoService(
		"/articulosManufacturados"
	);

	const sucursales = useAppSelector((state) => state.business.sucursales);
	const categorias = useAppSelector((state) => state.business.categorias);

	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	useEffect(() => {
		const traerEmpresas = async () => {
			const paises = await paisService.getAll();
			const provincias = await provinciaService.getAllMapped(paises);
			const localidades = await localidadService.getAllMapped(provincias);
			const domicilios = await domicilioService.getAllMapped(localidades);
			dispatch(setPaises(paises));
			dispatch(setProvincias(provincias));
			dispatch(setLocalidades(localidades));
			dispatch(setDomicilios(domicilios));

			const usuarios = await usuarioService.getAll();
			dispatch(setUsuarios(usuarios));

			const unidadMedidas = await unidadMedidaService.getAll();
			dispatch(setUnidadMedidas(unidadMedidas));

			const empresasData = await empresaService.getAll();
			dispatch(setEmpresas(empresasData));

			const categoriasData = await categoriaService.getAll();
			const categoriasMapeadas = categoriaService.mapCategorias(categoriasData);
			dispatch(setCategorias(categoriasMapeadas));

			const sucursales = await sucursalService.getAll();
			const sucursalesMapeadas = sucursalService.mapSucursales(
				sucursales,
				empresasData,
				domicilios
			);
			dispatch(setSucursales(sucursalesMapeadas));

			const articulos = await articuloService.getAll();

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
			);
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

	useEffect(() => {
		const filtrarCategorias = async () => {
			const categoriaSucursal = sucursal
				? await categoriaService.filterBySucursal(categorias ?? [], sucursal.id)
				: [];

			dispatch(setCategoriasSucursal(categoriaSucursal));
		};
		filtrarCategorias();
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
