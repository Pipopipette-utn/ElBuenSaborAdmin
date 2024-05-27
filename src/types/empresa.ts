import { ISucursalDTO } from "./dto";
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
	sucursales?: ISucursalDTO[];
	esNueva?: boolean;
}

export interface ICategoriaSucursal extends BaseEntity {
	sucursalId: number;
	categoriaId: number;
}

export interface IArticulo extends BaseEntity {
	denominacion: string;
	precioVenta: number | null;
	imagenes?: IImagen[];
	archivos?: FileList | null;
	categoria?: ICategoria;
	unidadMedida?: IUnidadMedida;
}

export interface IArticuloInsumo extends IArticulo {
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
	articuloManufacturadoDetalles?: IDetalleArticuloManufacturado[];
}

export interface IDetalleArticuloManufacturado extends BaseEntity {
	cantidad: number;
	articuloInsumo?: IArticuloInsumo;
}

export interface IDetalle extends BaseEntity {
	cantidad: number;
	articulo?: IArticuloManufacturado | IArticuloInsumo | IArticulo;
}

export interface IUnidadMedida extends BaseEntity {
	denominacion: string;
}

export interface IUsuario extends BaseEntity {
	username: string;
	password: string;
}

export interface IImagen {
	id: string;
	url: string;
	name: string;
}

export interface IPromocion extends BaseEntity {
	denominacion: string;
	fechaDesde: Date;
	fechaHasta: Date;
	horaDesde: string;
	horaHasta: string;
	descripcionDescuento: string;
	precioPromocional: number;
	tipoPromocion: "HAPPY_HOUR" | "PROMOCION" | "";
	imagenes: IImagen[];
	archivos?: FileList | null;
	sucursales: ISucursalDTO[];
	promocionDetalles: IDetalle[];
}
