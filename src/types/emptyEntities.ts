import { IArticulo, IArticuloInsumo, IArticuloManufacturado, IArticuloManufacturadoDetalle, ICategoria, IEmpresa, ISucursal, IUnidadMedida } from "./empresa";
import { IDomicilio, ILocalidad, IProvincia } from "./ubicacion";

export const emptyEmpresa: IEmpresa = {
	baja: false,
	nombre: "",
	razonSocial: "",
	cuil: 0,
	logo: "",
}

export const emptySucursal: ISucursal = {
	baja: false,
	nombre: "",
	horarioApertura: "00:00:00",
	horarioCierre: "00:00:00",
	logo: "",
	esCasaMatriz: false
}

export const emptyCategoria: ICategoria =  {
    baja: false,
	denominacion: "",
	subCategorias: [],
}

export const emptyArticulo: IArticulo =  {
    baja: false,
	denominacion: "",
	precioVenta: 0
}

export const emptyInsumo: IArticuloInsumo =  {
	... emptyArticulo,
	esParaElaborar: false,
	precioCompra: 0,
	stockActual: 0,
	stockMaximo: 0,
	stockMinimo: 0,
}

export const emptyArticuloManufacturado: IArticuloManufacturado =  {
	... emptyArticulo,
	preparacion: "",
	tiempoEstimadoMinutos: 0,
	descripcion: "",
	articuloManufacturadoDetalles: [],
}

export const emptyArticuloManufacturadoDetalle: IArticuloManufacturadoDetalle = {
	baja: false,
	cantidad: 0,
}

export const emptyProvincia: IProvincia = {
	baja: false,
	nombre: "",
}

export const emptyLocalidad: ILocalidad = {
	baja: false,
	nombre: "",
}

export const emptyDomicilio: IDomicilio = {
	baja: false,
	calle: ""
}

export const emptyUnidadDeMedida: IUnidadMedida = {
	baja: false,
	denominacion: "", 
}