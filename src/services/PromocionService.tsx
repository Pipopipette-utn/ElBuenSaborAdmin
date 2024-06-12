import { ISucursalDTO } from "../types/dto";
import { IPromocion } from "../types/empresa";
import { BackendClient } from "./BakendClient";

export class PromocionService extends BackendClient<IPromocion> {
	async createWithSucursal(data: IPromocion): Promise<IPromocion[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/create`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data), // Convierte los datos a JSON y los envía en el cuerpo de la solicitud
			});
			if (!response.ok) {
				return response.text().then((error) => {
					throw new Error(error);
				});
			}
			return response.json();
			return response.json(); // Retorna los datos en formato JSON
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async altaSucursales(
		id: number,
		sucursales: ISucursalDTO[]
	): Promise<IPromocion[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/${id}/duplicate`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(sucursales), // Convierte los datos a JSON y los envía en el cuerpo de la solicitud
			});
			if (!response.ok) {
				// Extrae el mensaje de error del cuerpo de la respuesta
				const errorData = await response.json();
				throw new Error(errorData.message || "Error desconocido");
			}
			return response.json(); // Retorna los datos en formato JSON
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getAllPagedBySucursal(
		sucursalId: number,
		page: number,
		size: number
	): Promise<{ data: IPromocion[]; total: number }> {
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
