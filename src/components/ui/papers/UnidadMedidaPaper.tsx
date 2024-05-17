import { FC } from "react";
import { Tooltip, IconButton, Typography } from "@mui/material";
import { HorizontalPaper } from "../styled/StyledPaper";
import { Stack } from "@mui/material";
import { IUnidadMedida } from "../../../types/empresa";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface UnidadMedidaPaperProps {
	unidadMedida: IUnidadMedida;
}

export const UnidadMedidaPaper: FC<UnidadMedidaPaperProps> = ({
	unidadMedida,
}) => {
	return (
		<HorizontalPaper>
			<Typography variant="body1">{unidadMedida.denominacion}</Typography>
			<Stack direction="row">
				<Tooltip title="Editar">
					<IconButton size="small" color="primary">
						<EditIcon fontSize="small" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Eliminar">
					<IconButton size="small" color="primary">
						<DeleteOutlineIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</Stack>
		</HorizontalPaper>
	);
};
