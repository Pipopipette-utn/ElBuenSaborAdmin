import { ICategoria } from "../types/empresa";

export const mapCategories = (
	categorias: ICategoria[] | null,
	esInsumo: boolean
) => {
	const result: string[] = [];

	function traverseAndFilter(categoryList: ICategoria[] | null) {
		categoryList!.forEach((categoria) => {
			if (categoria.esInsumo == esInsumo) {
				result.push(categoria.denominacion);
				if (categoria.subCategorias && categoria.subCategorias.length > 0) {
					traverseAndFilter(categoria.subCategorias);
				}
			}
		});
	}

	if (categorias != null) traverseAndFilter(categorias);

	return result.sort();
};

export const mapAllCategories = (categorias: ICategoria[] | null) => {
	const result: string[] = [];

	function traverseAndFilter(categoryList: ICategoria[] | null) {
		categoryList!.forEach((categoria) => {
			result.push(categoria.denominacion);
			if (categoria.subCategorias && categoria.subCategorias.length > 0) {
				traverseAndFilter(categoria.subCategorias);
			}
		});
	}

	if (categorias != null) traverseAndFilter(categorias);

	return result.sort();
};
