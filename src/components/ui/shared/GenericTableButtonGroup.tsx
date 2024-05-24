import { IconButton, Stack, Tooltip } from "@mui/material";
import { FC } from "react";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UpgradeIcon from '@mui/icons-material/Upgrade';

interface ButtonGroupProps {
	idEntity: number;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	onAlta?: (id: number) => void;
	onSeeDetails: (id: number) => void;
}

const ButtonGroup: FC<ButtonGroupProps> = ({
	idEntity,
	onDelete,
	onEdit,
	onSeeDetails,
	onAlta,
}) => {
	return (
		<Stack direction="row" sx={{ mr: "6px" }} spacing={-1}>
			{onEdit && (
				<Tooltip title="Editar">
					<IconButton onClick={() => onEdit(idEntity)}>
						<EditIcon fontSize="small" color="primary" />
					</IconButton>
				</Tooltip>
			)}
			<Tooltip title="Ver detalles">
				<IconButton onClick={() => onSeeDetails(idEntity)}>
					<VisibilityIcon fontSize="small" color="primary" />
				</IconButton>
			</Tooltip>
			{onDelete && (
				<Tooltip title="Eliminar">
					<IconButton onClick={() => onDelete(idEntity)}>
						<DeleteOutlineIcon fontSize="small" color="primary" />
					</IconButton>
				</Tooltip>
			)}
			{onAlta && (
				<Tooltip title="Dar de alta">
					<IconButton onClick={() => onAlta(idEntity)}>
						<UpgradeIcon fontSize="small" color="primary" />
					</IconButton>
				</Tooltip>
			)}
		</Stack>
	);
};

export default ButtonGroup;
