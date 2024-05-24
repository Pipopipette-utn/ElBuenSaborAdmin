import {
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { ICategoria } from "../../../types/empresa";
import { CategorySelect } from "./CategorySelect";
import { mapAllCategories } from "../../../utils/mapCategorias";

interface FilterFieldsProps {
	filter: string;
	onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	categorias: ICategoria[];
	categoryFilter: string;
	onCategoryFilterChange: (v: string | null) => void;
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
					sx={{ width: "120px", "& input": { fontSize: "14px" } }}
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
				<CategorySelect
					value={categoryFilter}
					onChange={onCategoryFilterChange}
					categorias={mapAllCategories(categorias)}
				/>
			</Stack>
		</Stack>
	);
};

export default FilterFields;
