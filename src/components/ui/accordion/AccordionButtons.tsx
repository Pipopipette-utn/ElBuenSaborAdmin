import { IconButton, Stack, Tooltip } from "@mui/material";
import "./AccordionStyles.css";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { ICategoria } from "../../../types/empresa";

export const ActionButtons = ({
	categoria,
	color,
	onEdit,
	onBaja,
	onDelete,
}: {
	categoria: ICategoria;
	color: string;
	onEdit: any;
	onBaja: () => void;
	onDelete: () => void;
}) => {
	return (
		<Stack direction="row" sx={{ mr: "6px" }} spacing={-1}>
			<Tooltip title="Editar">
				<IconButton onClick={(event) => onEdit(event, categoria)}>
					<EditIcon fontSize="small" sx={{ color: color }} />
				</IconButton>
			</Tooltip>

			<Tooltip title="Dar de baja en esta sucursal">
				<IconButton onClick={onBaja}>
					<ArrowCircleDownIcon fontSize="small" sx={{ color: color }} />
				</IconButton>
			</Tooltip>

			<Tooltip title="Eliminar categoría">
				<IconButton onClick={onDelete}>
					<DeleteOutlineIcon fontSize="small" sx={{ color: color }} />
				</IconButton>
			</Tooltip>
		</Stack>
	);
};
