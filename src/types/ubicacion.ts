import React from "react";

export interface IDomicilio extends BaseEntity {
	calle: string;
	numero?: number;
	cp?: number;
	piso?: number;
	nroDpto?: number;
	localidad?: ILocalidad;
	localidadId?: number;
}

export interface ILocalidad extends BaseEntity {
	nombre: string;
	provincia?: IProvincia;
	provincia_id?: number;
}

export interface IProvincia extends BaseEntity {
	nombre: string;
	pais?: IPais;
	pais_id?: number;
}

export interface IPais extends BaseEntity {
	nombre: string;
}

export const UbicacionContext =
	React.createContext<UbicacionContextValues | null>(null);

export interface UbicacionContextValues {
	pais?: IPais;
	provincia?: IProvincia;
	localidad?: ILocalidad;
	onChangePais: (p: IPais) => void;
	onChangeProvincia: (p: IProvincia) => void;
	onChangeLocalidad: (l: ILocalidad) => void;
}