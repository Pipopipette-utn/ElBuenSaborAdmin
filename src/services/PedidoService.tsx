// Importamos el tipo de dato IEmpresa y la clase BackendClient
import dayjs from "dayjs";
import { IPedido } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class PedidoService extends BackendClient<IPedido> {
	async getAllPagedBySucursal(
		sucursalId: number,
		page: number,
		size: number,
		estado?: string
	): Promise<{ data: IPedido[]; total: number }> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/porSucursal/${sucursalId}?${
					estado && `estado=${estado}&`
				}page=${page}&size=${size}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			const result = await response.json();
			return {
				data: result.content,
				total: result.totalElements,
			};
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async updateEstado(pedidoId: number, estado: number): Promise<IPedido> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/cambiarEstado/${pedidoId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: pedidoId, baja: false, estado }),
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getRecaudadoHoy(
		sucursalId: number
	): Promise<{ data: IPedido[]; total: number }> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/rankingComidas?fechaInicio=&fechaFin=sucursal=${sucursalId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			const result = await response.json();
			return {
				data: result.content,
				total: result.totalElements,
			};
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getRankingComidas(
		fechaInicio: string,
		fechaFin: string,
		sucursalId: number
	): Promise<Object[][]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/rankingComidas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&sucursalId=${sucursalId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getRecaudadoDia(
		fechaDesde: string,
		fechaHasta: string,
		sucursalId: number
	): Promise<Object[][]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/totalRecaudadoDiario?fechaInicio=${fechaDesde}&fechaFin=${fechaHasta}&sucursalId=${sucursalId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getRecaudadoMes(sucursalId: number): Promise<Object[][]> {
		try {
			const token = localStorage.getItem("token");
			const fechaInicio = dayjs().startOf("month").format("YYYY-MM-DD");
			const fechaFin = dayjs().endOf("month").format("YYYY-MM-DD");
			const response = await fetch(
				`${this.baseUrl}/totalRecaudadoMensual?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&sucursalId=${sucursalId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getGananciasDiarias(
		fechaDesde: string,
		fechaHasta: string,
		sucursalId: number
	): Promise<Object[][]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/totalGananciaDiario?fechaInicio=${fechaDesde}&fechaFin=${fechaHasta}&sucursalId=${sucursalId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getGananciasMensual(
		fechaDesde: string,
		fechaHasta: string,
		sucursalId: number
	): Promise<Object[][]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/totalGananciaMensual?fechaInicio=${fechaDesde}&fechaFin=${fechaHasta}&sucursalId=${sucursalId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}
}
