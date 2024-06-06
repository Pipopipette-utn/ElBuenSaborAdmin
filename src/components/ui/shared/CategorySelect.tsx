import { FC } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { ICategoria } from "../../../types/empresa";

export const CategorySelect: FC<{
	value: ICategoria | null;
	onChange: (e: ICategoria | null) => void;
	categorias: ICategoria[];
}> = ({ value, onChange, categorias }) => {
	return (
		<Autocomplete
			size="small"
			value={value}
			onChange={(_event, newValue) => {
				onChange(newValue);
			}}
			sx={{ width: "180px", fontSize: "14px" }}
			options={categorias}
			getOptionLabel={(option) => option.denominacion}
			renderInput={(params) => (
				<TextField {...params} label="Categoría" variant="outlined" />
			)}
		/>
	);
};
