import {
	Button,
	Stack,
	TextField,
	Typography,
	IconButton,
	InputAdornment
} from "@mui/material";
import { FC, useState } from "react";
import { ICategoria } from "../../../types/empresa";
import { CategorySelect } from "./CategorySelect";
import { mapAllCategories } from "../../../utils/mapCategorias";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface FilterFieldsProps {
	nameFilter: string;
	onNameFilterChange: (filtro: string | null) => void;
	categorias: ICategoria[];
	categoryFilter: ICategoria | null;
	onCategoryFilterChange: (v: ICategoria | null) => void;
}

const FilterFields: FC<FilterFieldsProps> = ({
	nameFilter,
	onNameFilterChange,
	categorias,
	categoryFilter,
	onCategoryFilterChange,
}) => {
	const [filtro, setFiltro] = useState(nameFilter);

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFiltro(event.target.value);
	};

	const handleClear = () => {
		setFiltro("");
		onNameFilterChange(null);
	};

	return (
		<Stack direction="row">
			<Stack
				spacing={1}
				direction="row"
				justifyContent="flex-start"
				alignItems="center"
				paddingLeft={2}
			>
				<TextField
					size="small"
					variant="outlined"
					value={filtro}
					onChange={handleFilterChange}
					sx={{ width: "184px", "& input": { fontSize: "14px" } }}
					placeholder="Buscar por nombre"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									aria-label="clear search"
									onClick={handleClear}
									edge="end"
									size="small"
								>
									<ClearIcon fontSize="small"/>
								</IconButton>
							</InputAdornment>
						)
					}}
				/>
				<Button
					variant="contained"
					onClick={() => onNameFilterChange(filtro)}
					startIcon={<SearchIcon sx={{marginRight: -1}}/>}
					sx={{paddingY: 1}}
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
