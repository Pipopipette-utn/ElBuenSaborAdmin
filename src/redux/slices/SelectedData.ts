import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategoria, IEmpresa, ISucursal } from "../../types/empresa";

interface IInitialState {
	empresa: IEmpresa | null;
	sucursalesEmpresa: ISucursal[] | null;
	sucursal: ISucursal | null;
	categoriasSucursal: ICategoria[] | null;
}

const initialState: IInitialState = {
	empresa: null,
	sucursalesEmpresa: null,
	sucursal: null,
	categoriasSucursal: null,
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
			console.log(action.payload)
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
	},
});

export const {
	setEmpresa,
	setSucursalesEmpresa,
	addSucursalEmpresa,
	editSucursalEmpresa,
	setSucursal,
	setCategoriasSucursal,
} = SelectedDataSlice.actions;
export default SelectedDataSlice.reducer;
