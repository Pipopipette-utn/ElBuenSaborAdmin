// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IArticuloManufacturadoTableDTO, ISucursalDTO } from "../types/dto";
import { IArticuloManufacturado } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class ArticuloManufacturadoService extends BackendClient<IArticuloManufacturado> {
	articulosManufacturadosToDTO = (
		productos: IArticuloManufacturado[]
	): IArticuloManufacturadoTableDTO[] => {
		const productosDTO = productos.map((producto) => {
			const productoDTO = {
				...producto,
				precioVenta: producto.precioVenta ? `$${producto.precioVenta}` : "-",
				unidadMedida: producto.unidadMedida?.denominacion,
				categoria: producto.categoria ? producto.categoria.denominacion : "-",
				articuloManufacturadoDetalle: [],
			};
			return productoDTO as IArticuloManufacturadoTableDTO;
		});
		return productosDTO;
	};

	async getAllPagedBySucursal(
		sucursalId: number,
		page: number,
		size: number
	): Promise<{ data: IArticuloManufacturado[]; total: number }> {
		const token = localStorage.getItem("token");
		try {
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

	async getAllPagedFiltered(
		sucursalId: number,
		page: number,
		size: number,
		categoriaId?: number,
		nombre?: string
	): Promise<{ data: IArticuloManufacturado[]; total: number }> {
		try {
			const token = localStorage.getItem("token");
			let url = `${this.baseUrl}/filtrar/${sucursalId}?page=${page}&size=${size}`;
			if (categoriaId) {
				url += `&categoriaId=${categoriaId}`;
			}
			if (nombre) {
				url += `&nombre=${nombre}`;
			}
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
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

	async getAllActiveBySucursal(
		sucursalId: number
	): Promise<IArticuloManufacturado[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${this.baseUrl}/activos/porSucursal/${sucursalId}`,
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

	async createWithSucursal(
		data: IArticuloManufacturado
	): Promise<IArticuloManufacturado[]> {
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

	async updateWithSucursal(
		id: number,
		data: IArticuloManufacturado
	): Promise<IArticuloManufacturado[]> {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${this.baseUrl}/update/${id}`, {
				method: "PUT",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data), // Convierte los datos a JSON y los envía en el cuerpo de la solicitud
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

	async altaSucursales(
		id: number,
		sucursales: ISucursalDTO[]
	): Promise<IArticuloManufacturado[]> {
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
}
