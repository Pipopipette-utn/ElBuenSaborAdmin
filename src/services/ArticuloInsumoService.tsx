// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IArticuloInsumoTableDTO } from "../types/dto";
import { IArticuloInsumo } from "../types/empresa";
import { BackendClient } from "./BakendClient";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class ArticuloInsumoService extends BackendClient<IArticuloInsumo> {
	articulosInsumosToDTO = (
		insumos: IArticuloInsumo[]
	): IArticuloInsumoTableDTO[] => {
		const insumosDTO = insumos.map((insumo) => {
			const insumoDTO = {
				...insumo,
				esParaElaborar: insumo.esParaElaborar ? (
					<TaskAltIcon color="primary" />
				) : (
					<RemoveCircleOutlineIcon color="primary" />
				),
				precioCompra: insumo.precioCompra ? `$${insumo.precioCompra}` : "-",
				precioVenta: insumo.precioVenta ? `$${insumo.precioVenta}` : "-",
				unidadMedida: insumo.unidadMedida?.denominacion,
				categoria: insumo.categoria ? insumo.categoria.denominacion : "-",
			};
			return insumoDTO as IArticuloInsumoTableDTO;
		});
		return insumosDTO;
	};

	async getAllPagedBySucursal(
		sucursalId: number,
		page: number,
		size: number
	): Promise<{ data: IArticuloInsumo[]; total: number }> {
		try {
			const response = await fetch(
				`${this.baseUrl}/porSucursal/${sucursalId}?page=${page}&size=${size}`
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
	): Promise<{ data: IArticuloInsumo[]; total: number }> {
		try {
			let url = `${this.baseUrl}/filtrar/${sucursalId}?page=${page}&size=${size}`;
			if (categoriaId) {
				url += `&categoriaId=${categoriaId}`;
			}
			if (nombre) {
				url += `&nombre=${nombre}`;
			}
			const response = await fetch(url);
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

	async getAllActiveBySucursal(sucursalId: number): Promise<IArticuloInsumo[]> {
		try {
			const response = await fetch(
				`${this.baseUrl}/activos/porSucursal/${sucursalId}`
			);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return await response.json();
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}

	async createWithSucursal(data: IArticuloInsumo): Promise<IArticuloInsumo[]> {
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
				throw Error(response.statusText);
			}
			return response.json(); // Retorna los datos en formato JSON
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}
}
