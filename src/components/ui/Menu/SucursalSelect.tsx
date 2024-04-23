import { MenuItem, SelectChangeEvent, styled } from "@mui/material";
import { useState } from "react";
import MuiSelect from "@mui/material/Select";

const Select = styled(MuiSelect)(({ theme }) => ({
	height: "42px",
	backgroundColor: theme.palette.bg.light,
	color: theme.palette.info.main,
	borderRadius: "50px",
    padding: "8px",
    "&:hover": {
        backgroundColor: theme.palette.bg.main,
        outline: "none",
      },
}));

export const SucursalSelect = () => {
	const [value, setValue] = useState("1");

	const handleChange = (event: SelectChangeEvent<{ value: string }>) => {
		setValue(event.target.value as string);
	};

	return (
		<Select
			labelId="demo-simple-select-label"
			id="demo-simple-select"
			value={value}
			onChange={handleChange}
		>
			<MenuItem value={1}>Sucursal1</MenuItem>
			<MenuItem value={2}>Sucursal2</MenuItem>
			<MenuItem value={3}>Sucursal3</MenuItem>
		</Select>
	);
};
