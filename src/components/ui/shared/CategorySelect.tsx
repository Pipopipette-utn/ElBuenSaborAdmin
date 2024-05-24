import { FC } from "react";
import { Autocomplete, TextField } from "@mui/material";

export const CategorySelect: FC<{
	value: string;
	onChange: (e: string | null) => void;
	categorias: string[];
}> = ({ value, onChange, categorias }) => {
	return (
		<Autocomplete
			size="small"
			value={value}
			onChange={(_event, newValue) => {
				onChange(newValue);
			}}
			sx={{ width: "200px", fontSize: "14px" }}
			options={categorias}
			getOptionLabel={(option) => option}
			renderInput={(params) => (
				<TextField {...params} label="Categoría" variant="outlined" />
			)}
		/>
	);
};
