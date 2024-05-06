import { IconButton, Stack, Tooltip } from "@mui/material";
import "./AccordionStyles.css";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { ICategoria } from "../../../types/empresa";

import { emptyCategoria } from "../../../types/emptyEntities";

export const ActionButtons = ({
	categoria,
	color,
	onClick,
}: {
	categoria: ICategoria;
	color: string;
	onClick: any;
}) => {
	return (
		<Stack direction="row" sx={{ mr: "6px" }} spacing={-1}>
			<Tooltip title="Editar">
				<IconButton>
					<EditIcon
						onClick={(event) => onClick(event, categoria)}
						fontSize="small"
						sx={{ color: color }}
					/>
				</IconButton>
			</Tooltip>
			<Tooltip title="Crear subcategoría">
				<IconButton>
					<AddCircleOutlineIcon
						onClick={(event) => onClick(event, emptyCategoria)}
						fontSize="small"
						sx={{ color: color }}
					/>
				</IconButton>
			</Tooltip>
			<Tooltip title="Eliminar categoría">
				<IconButton>
					<DeleteOutlineIcon fontSize="small" sx={{ color: color }} />
				</IconButton>
			</Tooltip>
		</Stack>
	);
};
