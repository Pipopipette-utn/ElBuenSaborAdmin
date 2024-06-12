// Importamos el tipo de dato IEmpresa y la clase BackendClient
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
}
