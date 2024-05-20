import { FC, useState } from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { ICategoria } from "../../../types/empresa";
import {
	AccordionSummary,
	Button,
	Checkbox,
	FormControlLabel,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";

import { theme } from "../../../styles/theme";
import tinycolor from "tinycolor2";
import { Accordion } from "../styled/StyledAccordion";

interface CategoriaFormAccordionProps {
	onChangeDenominaciones?: (c: ICategoria) => void;
	onChangeSubcategorias?: (c: ICategoria, i: number) => void;
	index?: number;
	initialCategoria: ICategoria;
	order: number;
	onDelete?: Function;
	insumo?: boolean;
}

export const CategoriaFormAccordion: FC<CategoriaFormAccordionProps> = ({
	onChangeDenominaciones,
	onChangeSubcategorias,
	index,
	initialCategoria,
	order,
	onDelete,
	insumo,
}) => {
	const [expanded, setExpanded] = useState(false);
	const [categoria, setCategoria] = useState(initialCategoria);
	const [esInsumo, setEsInsumo] = useState(insumo);

	const handleExpand = () => setExpanded((prev) => !prev);

	const handleChangeEsInsumo = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCategoria({ ...categoria, esInsumo: event.target.checked });
		setEsInsumo(event.target.checked);
	};

	const handleAddCategoria = (e: React.MouseEvent) => {
		if (expanded) e.stopPropagation();
		const newSubcategoria = {
			baja: false,
			denominacion: "",
			subCategorias: [],
			esInsumo: esInsumo ?? false,
		};
		const newCategoria = {
			...categoria,
			subCategorias: [...(categoria.subCategorias ?? []), newSubcategoria],
		};
		setCategoria(newCategoria);
	};

	const handleDelete = (index: number) => {
		const list: ICategoria[] = [...categoria.subCategorias!];
		list.splice(index, 1);
		const newCategoria = {
			...categoria,
			subCategorias: list,
		};
		setCategoria(newCategoria);
	};

	const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedCategoria = { ...categoria, denominacion: e.target.value };
		setCategoria(updatedCategoria);
		if (order > 0 && onChangeSubcategorias) {
			onChangeSubcategorias(updatedCategoria, index!);
		}
	};

	const handleSubcategoriaChange = (
		subcategoria: ICategoria,
		subIndex: number
	) => {
		const updatedSubcategorias = categoria.subCategorias!.map((subcat, idx) =>
			idx === subIndex ? subcategoria : subcat
		);
		const updatedCategoria = {
			...categoria,
			subCategorias: updatedSubcategorias,
		};
		setCategoria(updatedCategoria);
		if (order > 0 && onChangeSubcategorias) {
			onChangeSubcategorias(updatedCategoria, index!);
		}
	};

	const getDarkerColor = (color: string, level: number) => {
		return tinycolor(color)
			.darken(level * 6)
			.toString();
	};
	const subcategoriaColor = getDarkerColor(theme.palette.bg.main, order);

	return (
		<>
			<Accordion
				expanded={expanded}
				onChange={handleExpand}
				sx={{ backgroundColor: subcategoriaColor }}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography marginRight={1}>Denominación:</Typography>
					<TextField
						size="small"
						name="denominacion"
						value={categoria.denominacion}
						onChange={handleCategoriaChange}
						sx={{ backgroundColor: theme.palette.bg.main }}
						onClick={(e: React.MouseEvent) => e.stopPropagation()}
					/>
					<Stack direction="row" alignSelf="flex-end" spacing={-1}>
						<Tooltip color="primary" title="Agregar subcategoría">
							<IconButton size="medium" onClick={handleAddCategoria}>
								<AddCircleOutlineIcon fontSize="medium" />
							</IconButton>
						</Tooltip>
						{order > 0 && (
							<Tooltip color="primary" title="Eliminar">
								<IconButton
									size="medium"
									onClick={(e: React.MouseEvent) => {
										e.stopPropagation();
										if (onDelete) {
											onDelete(index!);
										}
									}}
								>
									<HighlightOffIcon fontSize="medium" />
								</IconButton>
							</Tooltip>
						)}
					</Stack>
				</AccordionSummary>

				{categoria.subCategorias && (
					<Stack
						direction="column"
						spacing={1}
						sx={{ p: "0px 12px 12px 12px" }}
					>
						{categoria.subCategorias.map((subcategoria, index) => (
							<CategoriaFormAccordion
								key={index}
								index={index}
								initialCategoria={subcategoria}
								order={order + 1}
								onDelete={handleDelete}
								onChangeSubcategorias={handleSubcategoriaChange}
								insumo={esInsumo}
							/>
						))}
					</Stack>
				)}
			</Accordion>
			{order === 0 && (
				<Stack width="80%">
					<Stack direction="row" alignItems="center" alignSelf="flex-start">
						<FormControlLabel
							control={
								<Checkbox
									checked={categoria.esInsumo}
									onChange={handleChangeEsInsumo}
								/>
							}
							label="Es insumo"
						/>
					</Stack>
					<Button
						variant="contained"
						sx={{ mt: 2, p: 1 }}
						onClick={() => {
							if (onChangeDenominaciones) onChangeDenominaciones(categoria);
						}}
					>
						Siguiente
					</Button>
				</Stack>
			)}
		</>
	);
};
