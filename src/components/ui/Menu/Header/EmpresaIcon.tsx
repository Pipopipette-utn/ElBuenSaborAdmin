import {
	Avatar,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
} from "@mui/material";
import { FC, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IEmpresa } from "../../../../types/empresa";
import { setEmpresa } from "../../../../redux/slices/SelectedData";


interface EmpresaIconProps {}

const EmpresaIcon: FC<EmpresaIconProps> = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const dispatch = useAppDispatch();
	const empresas = useAppSelector((state) => state.business.empresas);
	const empresa = useAppSelector((state) => state.selectedData.empresa);

	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSelect = (empresaSeleccionada: IEmpresa) => {
		dispatch(setEmpresa(empresaSeleccionada));
		handleClose();
	};

	return (
		<>
			<Tooltip title="Empresas">
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 2 }}
					aria-controls={open ? "account-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
				>
					<Avatar sx={{ width: 32, height: 32 }} src={empresa?.icon} />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&::before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							left: 30,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				{empresas?.map((e, index) => {
					if (e.id !== empresa?.id) {
						return (
							<MenuItem key={index} onClick={() => handleSelect(e)}>
								<Avatar src={e?.icon} /> {e.nombre}
							</MenuItem>
						);
					}
				})}
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<AddIcon fontSize="small" />
					</ListItemIcon>
					Agregar nueva empresa
				</MenuItem>
			</Menu>
		</>
	);
};

export default EmpresaIcon;
