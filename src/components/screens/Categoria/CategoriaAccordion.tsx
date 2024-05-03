import { AccordionSummary, IconButton, Stack, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./AccordionStyles.css";
import tinycolor from "tinycolor2";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { ICategoria } from "../../../types/empresa";
import { FC } from "react";
import { Accordion } from "../../ui/styled/StyledAccordion";
import { theme } from "../../../styles/theme";

export const CategoriaAccordion: FC<{
	categoria: ICategoria;
	order: number;
}> = ({ categoria, order }) => {
	const getDarkerColor = (color: string, level: number) => {
		return tinycolor(color)
			.darken(level * 6)
			.toString();
	};
	const subcategoriaColor = getDarkerColor(theme.palette.bg.light, order);
	const buttonsColor = getDarkerColor(
		order === 0 ? theme.palette.primary.main : theme.palette.info.light,
		order
	);

	return (
		<Accordion sx={{ backgroundColor: subcategoriaColor }}>
			{categoria.subcategorias && categoria.subcategorias.length > 0 ? (
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					{categoria.denominacion}
					<ActionButtons color={buttonsColor} />
				</AccordionSummary>
			) : (
				<AccordionSummary>
					{categoria.denominacion}
					<ActionButtons color={buttonsColor} />
				</AccordionSummary>
			)}
			{categoria.subcategorias && (
				<Stack direction="column" spacing={1} sx={{ p: "0px 12px 12px 12px" }}>
					{categoria.subcategorias.map((subcategoria, index) => (
						<CategoriaAccordion
							key={index}
							categoria={subcategoria}
							order={order + 1}
						/>
					))}
				</Stack>
			)}
		</Accordion>
	);
};

const ActionButtons = ({ color }: { color: string }) => {
	return (
		<Stack direction="row" sx={{ mr: "6px" }} spacing={-1}>
			<Tooltip title="Editar">
				<IconButton>
					<EditIcon fontSize="small" sx={{ color: color }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Crear subcategoría">
				<IconButton>
					<AddCircleOutlineIcon fontSize="small" sx={{ color: color }} />
				</IconButton>
			</Tooltip>
		</Stack>
	);
};
