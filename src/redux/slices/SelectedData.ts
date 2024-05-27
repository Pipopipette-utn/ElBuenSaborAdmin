import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	ICategoria,
	IEmpresa,
	IPromocion,
	ISucursal,
} from "../../types/empresa";

interface IInitialState {
	empresa: IEmpresa | null;
	sucursalesEmpresa: ISucursal[] | null;
	sucursal: ISucursal | null;
	categoriasSucursal: ICategoria[] | null;
	promocionesSucursal: IPromocion[] | null;
}

const initialState: IInitialState = {
	empresa: null,
	sucursalesEmpresa: null,
	sucursal: null,
	categoriasSucursal: null,
	promocionesSucursal: null,
};

//acá definimos el estado global
const SelectedDataSlice = createSlice({
	name: "SelectedDataSlice",
	initialState,
	reducers: {
		setEmpresa: (state, action: PayloadAction<IEmpresa | null>) => {
			state.empresa = action.payload;
		},
		setSucursalesEmpresa: (
			state,
			action: PayloadAction<ISucursal[] | null>
		) => {
			state.sucursalesEmpresa = action.payload;
		},
		addSucursalEmpresa: (state, action: PayloadAction<ISucursal>) => {
			console.log(action.payload);
			if (state.sucursalesEmpresa) {
				state.sucursalesEmpresa!.push(action.payload);
			} else {
				state.sucursalesEmpresa = [action.payload];
			}
		},
		editSucursalEmpresa: (state, action: PayloadAction<ISucursal>) => {
			const sucursalEditada = action.payload;
			if (state.sucursalesEmpresa) {
				state.sucursalesEmpresa = state.sucursalesEmpresa.map((sucursal) =>
					sucursal.id === sucursalEditada.id ? sucursalEditada : sucursal
				);
			}
		},
		setSucursal: (state, action: PayloadAction<ISucursal | null>) => {
			state.sucursal = action.payload;
		},
		setCategoriasSucursal: (
			state,
			action: PayloadAction<ICategoria[] | null>
		) => {
			state.categoriasSucursal = action.payload;
		},

		addCategoriaSucursal: (state, action: PayloadAction<ICategoria>) => {
			if (state.categoriasSucursal) {
				state.categoriasSucursal!.push(action.payload);
			} else {
				state.categoriasSucursal = [action.payload];
			}
		},
		editCategoriaSucursal: (state, action: PayloadAction<ICategoria>) => {
			const categoriaEditada = action.payload;
			if (state.categoriasSucursal) {
				state.categoriasSucursal = actualizarCategoriaEnLista(
					state.categoriasSucursal,
					categoriaEditada
				);
			}
		},
		setPromocionesSucursal: (
			state,
			action: PayloadAction<IPromocion[] | null>
		) => {
			state.promocionesSucursal = action.payload;
		},
		addPromocionesSucursal: (state, action: PayloadAction<IPromocion>) => {
			if (state.promocionesSucursal) {
				state.promocionesSucursal!.push(action.payload);
			} else {
				state.promocionesSucursal = [action.payload];
			}
		},
		editPromocionesSucursal: (state, action: PayloadAction<IPromocion>) => {
			const promocionEditada = action.payload;
			if (state.promocionesSucursal) {
				state.promocionesSucursal = state.promocionesSucursal.map((promocion) =>
					promocion.id === promocionEditada.id ? promocionEditada : promocion
				);
			}
		},
	},
});

export const {
	setEmpresa,
	setSucursalesEmpresa,
	addSucursalEmpresa,
	editSucursalEmpresa,
	setSucursal,
	setCategoriasSucursal,
	addCategoriaSucursal,
	editCategoriaSucursal,
	setPromocionesSucursal,
	addPromocionesSucursal,
	editPromocionesSucursal,
} = SelectedDataSlice.actions;
export default SelectedDataSlice.reducer;

// Función recursiva para actualizar la categoría en la lista de categorías y subcategorías
const actualizarCategoriaEnLista = (
	categorias: ICategoria[],
	categoriaEditada: ICategoria
): ICategoria[] => {
	return categorias.map((categoria) => {
		if (categoria.id === categoriaEditada.id) {
			// Si la categoría coincide con la categoría editada, devolver la categoría editada
			return categoriaEditada;
		} else if (categoria.subCategorias) {
			// Si la categoría tiene subcategorías, llamar recursivamente a esta función para actualizarlas también
			return {
				...categoria,
				subCategorias: actualizarCategoriaEnLista(
					categoria.subCategorias,
					categoriaEditada
				),
			};
		} else {
			// Si no es la categoría que estamos buscando y no tiene subcategorías, devolverla sin cambios
			return categoria;
		}
	});
};
