import { IDomicilio } from "./ubicacion";

export interface IEmpresa extends BaseEntity {
	nombre: string;
	razonSocial: string;
	cuil: number;
	logo: string;
	sucursales?: ISucursal[];
}

export interface ISucursal extends BaseEntity {
	nombre: string;
	horarioApertura: string;
	horarioCierre: string;
	logo: string;
	esCasaMatriz: boolean;
	empresa?: IEmpresa;
	domicilio?: IDomicilio;
	categorias?: ICategoria[];
	articulos?: IArticulo[];
}

export interface ICategoria extends BaseEntity {
	denominacion: string;
	subCategorias?: ICategoria[];
	categoriaPadre?: ICategoria;
	esInsumo: boolean;
}

export interface ICategoriaSucursal extends BaseEntity {
	sucursalId: number;
	categoriaId: number;
}

export interface IArticulo extends BaseEntity {
	denominacion: string;
	precioVenta: number | null;
	imagenes?: IImagen[];
	categoria?: ICategoria;
	unidadMedida?: IUnidadMedida;
}

export interface IArticuloInsumo extends IArticulo{
	precioCompra: number;
	stockActual: number;
	stockMaximo: number;
	stockMinimo: number;
	esParaElaborar: boolean;
}

export interface IArticuloManufacturado extends IArticulo {
	descripcion: string;
	tiempoEstimadoMinutos: number;
	preparacion: string;
	articuloManufacturadoDetalles?: IArticuloManufacturadoDetalle[];
}

export interface IArticuloManufacturadoDetalle extends BaseEntity {
	cantidad: number;
	articuloInsumo?: IArticuloInsumo;
}

export interface IUnidadMedida extends BaseEntity {
	denominacion: string;
}

export interface IUsuario extends BaseEntity {
	username: string;
	password: string;
}

export interface IImagen extends BaseEntity {
	url: string;
}
