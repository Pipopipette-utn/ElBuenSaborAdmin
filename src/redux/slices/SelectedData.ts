import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	IArticuloInsumo,
	IArticuloManufacturado,
	ICategoria,
	IEmpresa,
	IPromocion,
	ISucursal,
} from "../../types/empresa";
import { IEmpleado } from "../../types/usuarios";

interface IInitialState {
	empresa: IEmpresa | null;
	sucursalesEmpresa: ISucursal[] | null | "loading";
	sucursal: ISucursal | null;
	categoriasSucursal: ICategoria[] | null | "loading";
	promocionesSucursal: IPromocion[] | null | "loading";
	articulosInsumosSucursal: IArticuloInsumo[] | null;
	articulosManufacturadosSucursal: IArticuloManufacturado[] | null;
	empleadosSucursal: IEmpleado[] | null | "loading";
}

const initialState: IInitialState = {
	empresa: null,
	sucursalesEmpresa: null,
	sucursal: null,
	categoriasSucursal: null,
	promocionesSucursal: null,
	articulosInsumosSucursal: null,
	articulosManufacturadosSucursal: null,
	empleadosSucursal: null,
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
			action: PayloadAction<ISucursal[] | null | "loading">
		) => {
			state.sucursalesEmpresa = action.payload;
		},
		addSucursalEmpresa: (state, action: PayloadAction<ISucursal>) => {
			if (state.sucursalesEmpresa && state.sucursalesEmpresa !== "loading") {
				state.sucursalesEmpresa!.push(action.payload);
			} else {
				state.sucursalesEmpresa = [action.payload];
			}
		},
		editSucursalEmpresa: (state, action: PayloadAction<ISucursal>) => {
			const sucursalEditada = action.payload;
			if (state.sucursalesEmpresa && state.sucursalesEmpresa !== "loading") {
				state.sucursalesEmpresa = state.sucursalesEmpresa.map((sucursal) =>
					sucursal.id === sucursalEditada.id ? sucursalEditada : sucursal
				);
			}
		},
		setSelectedSucursal: (state, action: PayloadAction<ISucursal | null>) => {
			state.sucursal = action.payload;
		},
		setCategoriasSucursal: (
			state,
			action: PayloadAction<ICategoria[] | null | "loading">
		) => {
			state.categoriasSucursal = action.payload;
		},
		addCategoriaSucursal: (state, action: PayloadAction<ICategoria>) => {
			if (state.categoriasSucursal && state.categoriasSucursal !== "loading") {
				state.categoriasSucursal!.push(action.payload);
			} else {
				state.categoriasSucursal = [action.payload];
			}
		},
		editCategoriaSucursal: (state, action: PayloadAction<ICategoria>) => {
			const categoriaEditada = action.payload;
			if (state.categoriasSucursal && state.categoriasSucursal !== "loading") {
				state.categoriasSucursal = actualizarCategoriaEnLista(
					state.categoriasSucursal,
					categoriaEditada
				);
			}
		},
		setPromocionesSucursal: (
			state,
			action: PayloadAction<IPromocion[] | null | "loading">
		) => {
			state.promocionesSucursal = action.payload;
		},
		addPromocionesSucursal: (state, action: PayloadAction<IPromocion>) => {
			if (state.promocionesSucursal && state.promocionesSucursal !== "loading") {
				state.promocionesSucursal!.push(action.payload);
			} else {
				state.promocionesSucursal = [action.payload];
			}
		},
		editPromocionesSucursal: (state, action: PayloadAction<IPromocion>) => {
			const promocionEditada = action.payload;
			if (state.promocionesSucursal && state.promocionesSucursal !== "loading") {
				state.promocionesSucursal = state.promocionesSucursal.map((promocion) =>
					promocion.id === promocionEditada.id ? promocionEditada : promocion
				);
			}
		},
		setInsumosSucursal: (state, action: PayloadAction<IArticuloInsumo[] | null>) => {
			state.articulosInsumosSucursal = action.payload;
		},
		editArticuloInsumoSucursal: (state, action: PayloadAction<IArticuloInsumo>) => {
			const insumoEditado = action.payload;
			if (state.articulosInsumosSucursal) {
				state.articulosInsumosSucursal = state.articulosInsumosSucursal.map(
					(insumo) => (insumo.id === insumoEditado.id ? insumoEditado : insumo)
				);
			}
		},
		addArticuloInsumoSucursal: (state, action: PayloadAction<IArticuloInsumo>) => {
			if (state.articulosInsumosSucursal) {
				if (state.articulosInsumosSucursal.length < 6)
					state.articulosInsumosSucursal!.push(action.payload);
			} else {
				state.articulosInsumosSucursal = [action.payload];
			}
		},

		setManufacturadosSucursal: (
			state,
			action: PayloadAction<IArticuloManufacturado[] | null>
		) => {
			state.articulosManufacturadosSucursal = action.payload;
		},

		editArticuloManufacturadoSucursal: (
			state,
			action: PayloadAction<IArticuloManufacturado>
		) => {
			const insumoEditado = action.payload;
			if (state.articulosManufacturadosSucursal) {
				state.articulosManufacturadosSucursal =
					state.articulosManufacturadosSucursal.map((producto) =>
						producto.id === insumoEditado.id ? insumoEditado : producto
					);
			}
		},
		addArticuloManufacturadoSucursal: (
			state,
			action: PayloadAction<IArticuloManufacturado>
		) => {
			if (state.articulosManufacturadosSucursal) {
				state.articulosManufacturadosSucursal!.push(action.payload);
			} else {
				state.articulosManufacturadosSucursal = [action.payload];
			}
		},
		setEmpleadosSucursal: (
			state,
			action: PayloadAction<IEmpleado[] | null | "loading">
		) => {
			state.empleadosSucursal = action.payload;
		},
		addEmpleadoSucursal: (state, action: PayloadAction<IEmpleado>) => {
			if (state.empleadosSucursal && state.empleadosSucursal !== "loading") {
				state.empleadosSucursal!.push(action.payload);
			} else {
				state.empleadosSucursal = [action.payload];
			}
		},
		editEmpleadoSucursal: (state, action: PayloadAction<IEmpleado>) => {
			const empleadoEditado = action.payload;
			if (state.empleadosSucursal && state.empleadosSucursal !== "loading") {
				state.empleadosSucursal = state.empleadosSucursal.map((empleado) =>
					empleado.id === empleadoEditado.id ? empleadoEditado : empleado
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
	setSelectedSucursal,
	setCategoriasSucursal,
	addCategoriaSucursal,
	editCategoriaSucursal,
	setPromocionesSucursal,
	addPromocionesSucursal,
	editPromocionesSucursal,
	setInsumosSucursal,
	editArticuloInsumoSucursal,
	addArticuloInsumoSucursal,
	setManufacturadosSucursal,
	editArticuloManufacturadoSucursal,
	addArticuloManufacturadoSucursal,
	setEmpleadosSucursal,
	editEmpleadoSucursal,
	addEmpleadoSucursal,
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
