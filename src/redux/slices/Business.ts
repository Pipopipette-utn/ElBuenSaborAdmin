import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEmpresa, ISucursal } from "../../types/empresa";

interface IInitialState {
	empresas: IEmpresa[] | null;
	sucursales: ISucursal[] | null;
	empresa: IEmpresa | null;
	sucursalesEmpresa: ISucursal[] | null;
	sucursal: ISucursal | null;
}

const initialState: IInitialState = {
	empresas: null,
	sucursales: null,
	empresa: null,
	sucursalesEmpresa: null,
	sucursal: null,
};

//acá definimos el estado global
const BusinessSlice = createSlice({
	name: "AuthBusiness",
	initialState,
	reducers: {
		setEmpresas: (state, action: PayloadAction<IEmpresa[] | null>) => {
			state.empresas = action.payload;
		},
		setEmpresa: (state, action: PayloadAction<IEmpresa | null>) => {
			state.empresa = action.payload;
		},
		setSucursales: (state, action: PayloadAction<ISucursal[] | null>) => {
			state.sucursales = action.payload;
		},
		setSucursalesEmpresa: (state, action: PayloadAction<ISucursal[] | null>) => {
			state.sucursalesEmpresa = action.payload;
		},
		setSucursal: (state, action: PayloadAction<ISucursal | null>) => {
			state.sucursal = action.payload;
		},
	},
});

export const {
	setEmpresas,
	setEmpresa,
	setSucursales,
	setSucursalesEmpresa,
	setSucursal,
} = BusinessSlice.actions;
export default BusinessSlice.reducer;
