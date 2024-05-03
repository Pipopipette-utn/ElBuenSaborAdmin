// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IEmpresa, ISucursal } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase SucursalService que extiende BackendClient para interactuar con la API de personas
export class SucursalService extends BackendClient<ISucursal> {
	mapSucursales = (
		sucursales: ISucursal[],
		empresas: IEmpresa[]
	): ISucursal[] => {
		const sucursalesMapeadas: ISucursal[] = sucursales.map(
			(sucursal: ISucursal) => {
				const empresa = empresas?.find((e) => e.id == sucursal.empresaId);
				return {
					...sucursal,
					empresa: empresa,
				};
			}
		);
		return sucursalesMapeadas;
	};

	filterByEmpresaId = (sucursales: ISucursal[], id: number): ISucursal[] => {
		return sucursales.filter((s) => s.empresa!.id == id);
	};
}
