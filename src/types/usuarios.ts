import { ISucursalDTO } from "./dto";
import { IImagen } from "./empresa";

export interface IEmpleado extends BaseEntity {
	nombre: string;
	apellido: string;
	telefono: string;
	imagenPersona?: IImagen;
	fechaNacimiento: Date;
	usuario: IUsuario;
	sucursal?: ISucursalDTO;
}

export interface IUsuario extends BaseEntity {
	username: string;
	email: string;
	rol?: "SUPERADMIN" | "ADMIN" | "COCINERO" | "DELIVERY" | "CAJERO";
}
