import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	IArticuloInsumo,
	IArticuloManufacturado,
	IEmpresa,
	IUnidadMedida,
} from "../../types/empresa";
import { IUsuario } from "../../types/usuarios";

interface IInitialState {
	usuarios: IUsuario[] | null | "loading";
	unidadMedidas: IUnidadMedida[] | null | "loading";
	empresas: IEmpresa[] | null | "loading";
	articulosInsumos : IArticuloInsumo[] | null;
	articulosManufacturados : IArticuloManufacturado[] | null;
}

const initialState: IInitialState = {
	usuarios: null,
	unidadMedidas: null,
	empresas: null,
	articulosInsumos: null,
	articulosManufacturados: null,
};

//acá definimos el estado global
const BusinessSlice = createSlice({
	name: "BusinessSlice",
	initialState,
	reducers: {
		setUsuarios: (state, action: PayloadAction<IUsuario[] | null>) => {
			state.usuarios = action.payload;
		},
		setUnidadMedidas: (
			state,
			action: PayloadAction<IUnidadMedida[] | null | "loading">
		) => {
			state.unidadMedidas = action.payload;
		},
		addUnidadMedida: (state, action: PayloadAction<IUnidadMedida>) => {
			if (state.unidadMedidas && state.unidadMedidas != "loading") {
				state.unidadMedidas!.push(action.payload);
			} else {
				state.unidadMedidas = [action.payload];
			}
		},
		editUnidadMedida: (state, action: PayloadAction<IUnidadMedida>) => {
			const unidadEditada = action.payload;
			if (state.unidadMedidas && state.unidadMedidas != "loading") {
				state.unidadMedidas = state.unidadMedidas.map((unidad) =>
					unidad.id === unidadEditada.id ? unidadEditada : unidad
				);
			}
		},
		setEmpresas: (state, action: PayloadAction<IEmpresa[] | null | "loading">) => {
			state.empresas = action.payload;
		},
		setArticulosInsumos: (state, action: PayloadAction<IArticuloInsumo[] | null>) => {
			state.articulosInsumos = action.payload;
		},
		setArticulosManufacturados: (state, action: PayloadAction<IArticuloManufacturado[] | null>) => {
			state.articulosManufacturados = action.payload;
		},
		addArticuloInsumo: (state, action: PayloadAction<IArticuloInsumo>) => {
			if (state.articulosInsumos) {
				state.articulosInsumos!.push(action.payload);
			} else {
				state.articulosInsumos = [action.payload];
			}
		},
		editArticuloInsumo: (state, action: PayloadAction<IArticuloInsumo>) => {
			const articuloEditado = action.payload;
			if (state.articulosInsumos) {
				state.articulosInsumos = state.articulosInsumos.map((unidad) =>
					unidad.id === articuloEditado.id ? articuloEditado : unidad
				);
			}
		},
		addArticuloManufacturado: (state, action: PayloadAction<IArticuloManufacturado>) => {
			if (state.articulosManufacturados) {
				state.articulosManufacturados!.push(action.payload);
			} else {
				state.articulosManufacturados = [action.payload];
			}
		},
		editArticuloManufacturado: (state, action: PayloadAction<IArticuloManufacturado>) => {
			const articuloEditado = action.payload;
			if (state.articulosManufacturados) {
				state.articulosManufacturados = state.articulosManufacturados.map((unidad) =>
					unidad.id === articuloEditado.id ? articuloEditado : unidad
				);
			}
		},
	},
});

export const {
	setUsuarios,
	setUnidadMedidas,
	addUnidadMedida,
	editUnidadMedida,
	setEmpresas,
	setArticulosInsumos,
	addArticuloInsumo,
	editArticuloInsumo,
	setArticulosManufacturados,
	addArticuloManufacturado,
	editArticuloManufacturado,
} = BusinessSlice.actions;
export default BusinessSlice.reducer;
