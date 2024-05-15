import { ICategoria, IEmpresa, ISucursal } from "./empresa";
import { IDomicilio, ILocalidad, IProvincia } from "./ubicacion";

export const emptyEmpresa: IEmpresa = {
	baja: false,
	nombre: "",
	razonSocial: "",
	cuil: 0,
	icon: "",
}

export const emptySucursal: ISucursal = {
	baja: false,
	nombre: "",
	horarioApertura: "00:00:00",
	horarioCierre: "00:00:00",
	icon: ""
}

export const emptyCategoria: ICategoria =  {
    baja: false,
	denominacion: "",
	subcategorias: [],
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
	calle: "",
	cp: 0,
	numero: 0,
	nroDpto: 0,
	piso: 0,
}