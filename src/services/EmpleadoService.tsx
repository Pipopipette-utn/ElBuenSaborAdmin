import { IEmpleado } from "../types/usuarios";
import { BackendClient } from "./BakendClient";

export class EmpleadoService extends BackendClient<IEmpleado> {
	async getEmpleadoByMail(mail: string): Promise<IEmpleado | null> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/filter?email=${mail}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				if (response.status == 404) {
					return null;
				}
				throw new Error(`Error fetching usuario: ${response.statusText}`);
			}
			return response.json();
		} catch (error) {
			console.error("Error fetching usuario:", error);
			throw error;
		}
	}

	async getAllPagedBySucursal(
		sucursalId: number,
		page: number,
		size: number
	): Promise<{ data: IEmpleado[]; total: number }> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/porSucursal/${sucursalId}?page=${page}&size=${size}`,
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
}
