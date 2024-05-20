import {
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { ICategoria } from "../../../types/empresa";

interface FilterFieldsProps {
	filter: string;
	onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	categorias: ICategoria[];
	categoryFilter: string;
	onCategoryFilterChange: (event: SelectChangeEvent<string>) => void;
}

const FilterFields: FC<FilterFieldsProps> = ({
	filter,
	onFilterChange,
	categorias,
	categoryFilter,
	onCategoryFilterChange,
}) => {
	return (
		<Stack direction="row">
			<Stack
				spacing={1}
				direction="row"
				justifyContent="flex-start"
				alignItems="center"
				paddingLeft={3}
			>
				<Typography variant="h6">Buscar:</Typography>
				<TextField
					size="small"
					variant="outlined"
					value={filter}
					onChange={onFilterChange}
					sx={{ width: "90px", "& input": { fontSize: "14px" } }}
				/>
			</Stack>
			<Stack
				spacing={1}
				direction="row"
				justifyContent="flex-start"
				alignItems="center"
				paddingLeft={3}
			>
				<Typography variant="h6">Filtrar por categoría:</Typography>
				<Select
					size="small"
					value={categoryFilter}
					onChange={onCategoryFilterChange}
					sx={{ width: "120px", fontSize: "14px" }}
				>
					<MenuItem value="">Ninguna</MenuItem>
					{categorias &&
						categorias!.map((categoria, index) => (
							<MenuItem key={index} value={categoria!.denominacion}>
								{categoria!.denominacion}
							</MenuItem>
						))}
				</Select>
			</Stack>
		</Stack>
	);
};

export default FilterFields;
