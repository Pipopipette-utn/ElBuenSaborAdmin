import { IconButton, Stack, Tooltip } from "@mui/material";
import { FC } from "react";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface ButtonGroupProps {}

const ButtonGroup: FC<ButtonGroupProps> = () => {
	return (
		<Stack direction="row" sx={{ mr: "6px" }} spacing={-1}>
			<Tooltip title="Editar">
				<IconButton>
					<EditIcon fontSize="small" color="primary" />
				</IconButton>
			</Tooltip>
			<Tooltip title="Ver detalles">
				<IconButton>
					<VisibilityIcon fontSize="small" color="primary" />
				</IconButton>
			</Tooltip>
			<Tooltip title="Eliminar artículo">
				<IconButton>
					<DeleteOutlineIcon fontSize="small" color="primary" />
				</IconButton>
			</Tooltip>
		</Stack>
	);
};

export default ButtonGroup;
