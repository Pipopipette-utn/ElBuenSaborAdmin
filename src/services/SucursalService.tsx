// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { ICategoria, IEmpresa, IPromocion, ISucursal } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase SucursalService que extiende BackendClient para interactuar con la API de personas
export class SucursalService extends BackendClient<ISucursal> {
	async getAllByEmpresa(idEmpresa: number): Promise<ISucursal[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/empresa/${idEmpresa}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json(); // Retorna los datos en formato JSON
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async getCategorias(id: number): Promise<ICategoria[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/${id}/categorias`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error(`Error fetching categorias: ${response.statusText}`);
			}
			return response.json();
		} catch (error) {
			console.error("Error fetching categorias:", error);
			throw error;
		}
	}

	async getPromociones(id: number): Promise<IPromocion[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/${id}/promociones`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
			if (!response.ok) {
				throw new Error(`Error fetching promociones: ${response.statusText}`);
			}
			return response.json();
		} catch (error) {
			console.error("Error fetching promociones:", error);
			throw error;
		}
	}

	async getEmpresa(id: number): Promise<IEmpresa> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/sucursal/${id}/empresa`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
			if (!response.ok) {
				throw new Error(`Error fetching promociones: ${response.statusText}`);
			}
			return response.json();
		} catch (error) {
			console.error("Error fetching promociones:", error);
			throw error;
		}
	}
}
