import { ICategoria, IEmpresa, ISucursal } from "./empresa";
import { IDomicilio, ILocalidad, IProvincia } from "./ubicacion";

export const emptyEmpresa: IEmpresa = {
	eliminado: false,
	nombre: "",
	razonSocial: "",
	cuil: 0,
	logo: "",
}

export const emptySucursal: ISucursal = {
	eliminado: false,
	nombre: "",
	horarioApertura: "00:00:00",
	horarioCierre: "00:00:00",
	logo: ""
}

export const emptyCategoria: ICategoria =  {
    eliminado: false,
	denominacion: "",
	subcategorias: [],
}

export const emptyProvincia: IProvincia = {
	eliminado: false,
	nombre: "",
}

export const emptyLocalidad: ILocalidad = {
	eliminado: false,
	nombre: "",
}

export const emptyDomicilio: IDomicilio = {
	eliminado: false,
	calle: ""
}