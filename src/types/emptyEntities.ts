import { ICategoria, IEmpresa } from "./empresa";

export const emptyEmpresa: IEmpresa = {
	baja: false,
	nombre: "",
	razonSocial: "",
	cuil: 0,
	icon: "",
}

export const emptyCategoria: ICategoria =  {
    baja: false,
	denominacion: "",
	subcategorias: [],
}