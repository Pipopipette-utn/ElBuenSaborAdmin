import { IconButton, Stack, Tooltip } from "@mui/material";
import "./AccordionStyles.css";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useAppSelector } from "../../../redux/hooks";

export const ActionButtons = ({
	entity,
	color,
	onEdit,
	onBaja,
	onAlta,
	onAltaSucursales,
	onDelete,
}: {
	entity: any;
	color: string;
	onEdit: any;
	onBaja?: () => void;
	onAlta?: () => void;
	onAltaSucursales?: () => void;
	onDelete?: () => void;
}) => {
	const user = useAppSelector((state) => state.auth.user);
	const disabled = user!.rol! === "CAJERO" || user!.rol! === "COCINERO";
	return (
		<Stack direction="row" sx={{ mr: "6px" }} spacing={-1}>
			{onBaja && (
				<Tooltip title="Editar">
					<IconButton
						disabled={onAlta || disabled ? true : false}
						onClick={(event) => onEdit(event, entity)}
					>
						<EditIcon fontSize="small" sx={{ color: color }} />
					</IconButton>
				</Tooltip>
			)}
			{onBaja && (
				<Tooltip title="Dar de baja en esta sucursal">
					<IconButton
						disabled={disabled}
						onClick={(
							event: React.MouseEvent<HTMLButtonElement, MouseEvent>
						) => {
							event.stopPropagation();
							onBaja();
						}}
					>
						<ArrowCircleDownIcon fontSize="small" sx={{ color: color }} />
					</IconButton>
				</Tooltip>
			)}

			{onDelete && (
				<Tooltip title="Eliminar">
					<IconButton disabled={disabled} onClick={onDelete}>
						<DeleteOutlineIcon fontSize="small" sx={{ color: color }} />
					</IconButton>
				</Tooltip>
			)}

			{onAlta && (
				<Tooltip title="Dar de alta en esta sucursal">
					<IconButton disabled={disabled} onClick={onAlta}>
						<UpgradeIcon fontSize="small" sx={{ color: color }} />
					</IconButton>
				</Tooltip>
			)}

			{onAltaSucursales && (
				<Tooltip title="Dar de alta en otras sucursales">
					<IconButton disabled={disabled} onClick={onAltaSucursales}>
						<UpgradeIcon fontSize="small" sx={{ color: color }} />
					</IconButton>
				</Tooltip>
			)}
		</Stack>
	);
};
