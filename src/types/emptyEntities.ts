import {
	IArticulo,
	IArticuloInsumo,
	IArticuloManufacturado,
	IDetalle,
	ICategoria,
	IEmpresa,
	IPromocion,
	ISucursal,
	IUnidadMedida,
} from "./empresa";
import { IDomicilio, ILocalidad, IProvincia } from "./ubicacion";
import { IEmpleado, IUsuario } from "./usuarios";

export const emptyEmpresa: IEmpresa = {
	baja: false,
	nombre: "",
	razonSocial: "",
	cuil: 0,
	logo: "",
};

export const emptySucursal: ISucursal = {
	baja: false,
	nombre: "",
	horarioApertura: "00:00:00",
	horarioCierre: "00:00:00",
	logo: "",
	esCasaMatriz: false,
};

export const emptyCategoria: ICategoria = {
	baja: false,
	denominacion: "",
	subCategorias: [],
	esInsumo: false,
	esParaVender: false,
};

export const emptyArticulo: IArticulo = {
	baja: false,
	denominacion: "",
	precioVenta: 0,
};

export const emptyInsumo: IArticuloInsumo = {
	...emptyArticulo,
	esParaElaborar: false,
	precioCompra: 0,
	stockActual: 0,
	stockMaximo: 0,
	stockMinimo: 0,
};

export const emptyArticuloManufacturado: IArticuloManufacturado = {
	...emptyArticulo,
	preparacion: "",
	tiempoEstimadoMinutos: 0,
	descripcion: "",
	articuloManufacturadoDetalles: [],
};

export const emptyArticuloManufacturadoDetalle: IDetalle = {
	baja: false,
	cantidad: 0,
};

export const emptyProvincia: IProvincia = {
	baja: false,
	nombre: "",
};

export const emptyLocalidad: ILocalidad = {
	baja: false,
	nombre: "",
};

export const emptyDomicilio: IDomicilio = {
	baja: false,
	calle: "",
};

export const emptyUnidadDeMedida: IUnidadMedida = {
	baja: false,
	denominacion: "",
};

export const emptyPromocion: IPromocion = {
	baja: false,
	denominacion: "",
	fechaDesde: new Date(),
	fechaHasta: new Date(),
	horaDesde: "00:00:00",
	horaHasta: "00:00:00",
	descripcionDescuento: "",
	precioPromocional: 0,
	tipoPromocion: "",
	imagenes: [],
	promocionDetalles: [],
};

export const emptyUsuario: IUsuario = {
	baja: false,
	username: "",
	email: "",
};

export const emptyEmpleado: IEmpleado = {
	baja: false,
	nombre: "",
	apellido: "",
	telefono: "",
	fechaNacimiento: new Date(),
	usuario: emptyUsuario,
};
