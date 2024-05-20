import { ReactElement } from "react";
import { IArticuloManufacturadoDetalle } from "./empresa";

export interface IArticuloInsumoTableDTO {
    denominacion: string;
	precioVenta: string;
	precioCompra: string;
	categoria?: string;
	unidadMedida: string;
	stockActual: number;
	stockMaximo: number;
	stockMinimo: number;
	esParaElaborar: ReactElement;
}

export interface IArticuloManufacturadoTableDTO {
    denominacion: string;
	precioVenta: string;
	categoria?: string;
	unidadMedida: string;
    descripcion: string;
	tiempoEstimadoMinutos: number;
	preparacion: string;
	articuloManufacturadoDetalle: IArticuloManufacturadoDetalle[];
}