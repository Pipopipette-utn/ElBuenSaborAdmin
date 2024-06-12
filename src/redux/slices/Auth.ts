import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEmpleado, IUsuario } from "../../types/usuarios";

interface IInitialState {
	user: IUsuario | null;
	empleado: IEmpleado | null;
	login: boolean;
}

const initialState: IInitialState = {
	user: null,
	empleado: null,
	login: false,
};

//acá definimos el estado global
const AuthUser = createSlice({
	name: "AuthUser",
	initialState,
	reducers: {
		login: (state) => {
			state.login = true;
		},
		logout: (state) => {
			state.login = false;
			state.user = null;
			state.empleado = null;
		},
		setUser: (state, action: PayloadAction<IUsuario>) => {
			state.user = action.payload;
		},
		setEmpleado: (state, action: PayloadAction<IEmpleado>) => {
			state.empleado = action.payload;
		}
	},
});

export const { login, logout, setUser, setEmpleado} = AuthUser.actions;
export default AuthUser.reducer;
