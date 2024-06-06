import { MenuItem, SelectChangeEvent, styled } from "@mui/material";
import { useEffect, useState } from "react";
import MuiSelect from "@mui/material/Select";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ISucursal } from "../../../../types/empresa";
import { setSelectedSucursal } from "../../../../redux/slices/SelectedData";

const Select = styled(MuiSelect)(({ theme }) => ({
	height: "42px",
	backgroundColor: theme.palette.bg.light,
	color: theme.palette.info.main,
	borderRadius: "50px",
	padding: "8px",
	"&:hover": {
		backgroundColor: theme.palette.bg.main,
	},
}));

export const SucursalSelect = () => {
	const dispatch = useAppDispatch();
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);
	const [sucursalSeleccionada, setSucursalSeleccionada] =
		useState<ISucursal | null>(sucursal);

	const handleChange = (event: SelectChangeEvent<unknown>) => {
		if (Array.isArray(sucursales)){
			const s = sucursales?.find((suc) => suc.id! === event.target.value);
			dispatch(setSelectedSucursal(s!));
			setSucursalSeleccionada(s || null);
		}
	};

	useEffect(() => {
		setSucursalSeleccionada(sucursal);
	}, [sucursal]);

	return (
		<Select value={sucursalSeleccionada?.id || ""} onChange={handleChange}>
			{Array.isArray(sucursales) && sucursales.map((s, index) => (
				<MenuItem value={s.id!} key={index}>
					{s.nombre}
				</MenuItem>
			))}
		</Select>
	);
};
