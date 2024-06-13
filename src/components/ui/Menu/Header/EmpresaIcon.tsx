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
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IEmpresa } from "../../../../types/empresa";
import { setEmpresa } from "../../../../redux/slices/SelectedData";
import GenericModal from "../../shared/GenericModal";
import { SuccessMessage } from "../../shared/SuccessMessage";
import { EmpresaForm } from "../../forms/EmpresaForm";
import { ErrorMessage } from "../../shared/ErrorMessage";
import { emptyEmpresa } from "../../../../types/emptyEntities";

interface EmpresaIconProps {}

const EmpresaIcon: FC<EmpresaIconProps> = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showModal, setShowModal] = useState(false);
	const dispatch = useAppDispatch();
	const empresas = useAppSelector((state) => state.business.empresas);
	const empresa = useAppSelector((state) => state.selectedData.empresa);
	const user = useAppSelector((state) => state.auth.user);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (user!.rol === "SUPERADMIN") {
			setAnchorEl(event.currentTarget);
		}
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
			<Tooltip
				title={user!.rol === "SUPERADMIN" ? "Empresas" : "Editar mi empresa"}
			>
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 2 }}
					aria-controls={open ? "account-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
				>
					<Avatar sx={{ width: 32, height: 32 }} src={empresa?.logo} />
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
				{empresas &&
					empresas !== "loading" &&
					empresas?.map((e, index) => {
						if (e.id !== empresa?.id) {
							return (
								<MenuItem key={index} onClick={() => handleSelect(e)}>
									<Avatar src={e?.logo} /> {e.nombre}
								</MenuItem>
							);
						}
					})}
				<Divider />
				<MenuItem onClick={handleOpenModal}>
					<ListItemIcon>
						<AddIcon fontSize="small" />
					</ListItemIcon>
					Agregar nueva empresa
				</MenuItem>
			</Menu>
			<GenericModal
				title={"Crear empresa"}
				icon={<AddBusinessIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<EmpresaForm
					empresa={emptyEmpresa}
					onClose={handleCloseModal}
					onShowSuccess={handleShowSuccess}
					onShowError={handleShowError}
				/>
			</GenericModal>
			<SuccessMessage
				open={!!showSuccess}
				onClose={handleCloseSuccess}
				message={showSuccess}
			/>
			<ErrorMessage
				open={!!showError}
				onClose={handleCloseError}
				message={showError}
			/>
		</>
	);
};

export default EmpresaIcon;
