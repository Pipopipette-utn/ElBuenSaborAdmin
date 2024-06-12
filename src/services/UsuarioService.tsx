// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IUsuario } from "../types/usuarios";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class UsuarioService extends BackendClient<IUsuario> {
	async getUsuarioByMail(mail: string): Promise<IUsuario> {
		try {
			const response = await fetch(`${this.baseUrl}/filter?email=${mail}`);
			if (!response.ok) {
				throw new Error(`Error fetching usuario: ${response.statusText}`);
			}
			console.log(response);
			return await response.json();
		} catch (error) {
			console.error("Error fetching usuario:", error);
			throw error;
		}
	}
}
