// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { ICategoria } from "../types/empresa";
import { BackendClient } from "./BakendClient";
import { CategoriaSucursalService } from "./CategoriaSucursalService";

// Clase CategoriaService que extiende BackendClient para interactuar con la API de categorias
export class CategoriaService extends BackendClient<ICategoria> {
	//Este metodo organiza las categorías de manera recursiva -> cat1: {..., subgategorias: [cat2, cat3] }
	mapCategorias = (
		categorias: ICategoria[],
		parentId?: number
	): ICategoria[] => {
		return categorias
			.filter((categoria) => categoria.categoriaPadreId == parentId)
			.map((categoria) => ({
				...categoria,
				subcategorias: this.mapCategorias(categorias, categoria.id),
			}));
	};

	filterBySucursal = async (
		categorias: ICategoria[],
		sucursalId?: number
	): Promise<ICategoria[]> => {
		const categoriaSucursalService = new CategoriaSucursalService(
			"/categoriasSucursales"
		);
		const categoriasSucursales = await categoriaSucursalService.getAll();
		const categoriasFiltradas: ICategoria[] = [];

		categoriasSucursales.forEach((categoriaSucursal) => {
			if (sucursalId == categoriaSucursal.sucursalId) {
				const categoria = categorias.find((c) => c.id == categoriaSucursal.categoriaId);
				if (categoria) categoriasFiltradas.push(categoria);
			}
		});

		return categoriasFiltradas;
	};
}
