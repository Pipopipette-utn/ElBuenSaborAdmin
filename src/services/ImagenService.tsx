// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IImagen } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class ImagenService extends BackendClient<IImagen> {
	async crearImagen(selectedFiles: File[], idEntidad: number): Promise<any> {
		try {
			// Crear un objeto FormData y agregar los archivos seleccionados
			const formData = new FormData();
			Array.from(selectedFiles).forEach((file) => {
				formData.append("uploads", file);
				console.log({file});
			});

			console.log({selectedFiles});
			// Realizar la petición POST para subir los archivos
			const response = await fetch(`${this.baseUrl}/${idEntidad}`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}
}
