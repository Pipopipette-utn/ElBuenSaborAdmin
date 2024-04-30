export interface IEmpresa extends BaseEntity {
	nombre: string;
	razonSocial: string;
	cuil: number;
	icon: string;
	sucursales: ISucursal[];
}

export interface ISucursal extends BaseEntity {
	nombre: string;
	horarioApertura: string;
	horarioCierre: number;
	icon: string;
	empresa: IEmpresa;
}

export interface ISucursalBD extends BaseEntity {
	nombre: string;
	horarioApertura: string;
	horarioCierre: number;
	empresa_id: number;
}
