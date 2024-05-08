// Importamos el tipo de dato IDomicilio y la clase BackendClient
import { IDomicilio } from "../types/ubicaciones";
import { BackendClient } from "./BakendClient";

// Clase DomicilioService que extiende BackendClient para interactuar con la API de domiilios
export class DomicilioService extends BackendClient<IDomicilio> {
	async getAll(): Promise<IDomicilio[]> {
		try {
			const response = await fetch(`${this.baseUrl}`);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			const domicilios = (await response.json()) as IDomicilio[];
			const responseLocalidades = await fetch(
				`${import.meta.env.VITE_API_URL}/localidades`
			);

			const localidades = await responseLocalidades.json();
			const domiciliosMapeados = domicilios.map((domicilio) => {
				const localidad = localidades.find(
					(localidad: any) => localidad.id == domicilio.localidadId
				);
				return { ...domicilio, localidad: localidad.nombre };
			});
            
			return domiciliosMapeados; // Retorna los datos en formato JSON
		} catch (error) {
			return Promise.reject(error); // Rechaza la promesa con el error
		}
	}
}
