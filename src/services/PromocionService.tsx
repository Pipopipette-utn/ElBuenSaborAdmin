import { IPromocion } from "../types/empresa";
import { BackendClient } from "./BakendClient";

export class PromocionService extends BackendClient<IPromocion> {

    async createWithSucursal(data: IPromocion): Promise<IPromocion[]> {
		try {
			const response = await fetch(`${this.baseUrl}/create`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
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
		sucursales: IPromocion[]
	): Promise<IPromocion[]> {
		try {
			const response = await fetch(`${this.baseUrl}/${id}/duplicate`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
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

}
