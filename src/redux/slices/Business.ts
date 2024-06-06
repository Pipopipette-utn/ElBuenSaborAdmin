import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	IArticuloInsumo,
	IArticuloManufacturado,
	IEmpresa,
	IUnidadMedida,
	IUsuario,
} from "../../types/empresa";

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
	},
});

export const {
	setUsuarios,
	setUnidadMedidas,
	addUnidadMedida,
	editUnidadMedida,
	setEmpresas,
	setArticulosInsumos,
	setArticulosManufacturados,
} = BusinessSlice.actions;
export default BusinessSlice.reducer;
