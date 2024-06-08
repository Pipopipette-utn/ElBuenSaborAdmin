import { ICategoria } from "../types/empresa";

export const mapCategories = (
	categorias: ICategoria[] | null,
	esInsumo: boolean,
	esParaVender: boolean,
) => {
	const result: any[] = [];

	function traverseAndFilter(categoryList: ICategoria[] | null) {
		categoryList!.forEach((categoria) => {
			if (categoria.esInsumo == esInsumo && categoria.esParaVender == esParaVender) {
				result.push(categoria);
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
	const result: ICategoria[] = [];

	function traverseAndFilter(categoryList: ICategoria[] | null) {
		categoryList!.forEach((categoria) => {
			result.push(categoria);
			if (categoria.subCategorias && categoria.subCategorias.length > 0) {
				traverseAndFilter(categoria.subCategorias);
			}
		});
	}

	if (categorias != null) traverseAndFilter(categorias);

	return result.sort();
};

export const findCategory = (
	categorias: ICategoria[] | null,
	denominacion: string
): ICategoria | undefined => {
	if (!categorias) return undefined;

	function findCategory(
		categoryList: ICategoria[],
		denominacion: string
	): ICategoria | undefined {
		for (const categoria of categoryList) {
			if (categoria.denominacion === denominacion) {
				return categoria;
			}
			if (categoria.subCategorias && categoria.subCategorias.length > 0) {
				const subCategoria = findCategory(
					categoria.subCategorias,
					denominacion
				);
				if (subCategoria) {
					return subCategoria;
				}
			}
		}
		return undefined;
	}

	return findCategory(categorias, denominacion);
};
