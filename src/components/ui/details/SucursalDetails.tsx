import { FC } from "react";
import { ISucursal } from "../../../types/empresa";
import { IconButton, Modal, Stack, Typography } from "@mui/material";
import { modalStyle } from "../shared/GenericModal";
import { DetailsGroup } from "../shared/DetailsGroup";

import StoreMallDirectoryOutlinedIcon from "@mui/icons-material/StoreMallDirectoryOutlined";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import CloseIcon from "@mui/icons-material/Close";

import { theme } from "../../../styles/theme";

interface SucursalDetailstProps {
	sucursal: ISucursal;
	open: boolean;
	handleClose: () => void;
}

export const SucursalDetails: FC<SucursalDetailstProps> = ({
	sucursal,
	open,
	handleClose,
}) => {
	const labelsDpto = [];
	const contentDpto = [];
	if (sucursal.domicilio!.piso) {
		labelsDpto.push("Piso");
		contentDpto.push(sucursal.domicilio!.piso.toString());
	}
	if (sucursal.domicilio!.nroDpto) {
		labelsDpto.push("Departamento");
		contentDpto.push(sucursal.domicilio!.nroDpto.toString());
	}

	return (
		<Modal open={open} onClose={handleClose}>
			<Stack width="100%" sx={modalStyle} alignItems="center">
				<Stack width="100%" direction="row" sx={{ borderRadius: "20px" }}>
					<img
						src={
							sucursal.imagenSucursal && sucursal.imagenSucursal.url
								? sucursal.imagenSucursal.url
								: `https://via.placeholder.com/150/FCFCFC/FF4F33?text=${sucursal.nombre.charAt(
										0
								  )}`
						}
						alt="Logo"
						width="340px"
						height="340px"
						style={{
							borderRadius: "20px",
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
							minWidth: "340px",
							maxHeight: "300px",
							objectFit: "contain"
						}}
					/>
					<Stack
						width="100%"
						padding="16px 10px"
						justifyContent="center"
						alignItems="center"
					>
						<Typography variant="h4" sx={{ fontSize: 18 }}>
							Detalles de la sucursal
						</Typography>
						<DetailsGroup
							labels={["Nombre"]}
							content={[sucursal.nombre]}
							icons={[
								<StoreMallDirectoryOutlinedIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,
							]}
						/>
						<DetailsGroup
							labels={["Horario Apertura", "Horario Cierre"]}
							content={[sucursal.horarioApertura, sucursal.horarioCierre]}
							icons={[
								<AccessTimeFilledRoundedIcon color="primary" />,
								<AccessTimeFilledRoundedIcon color="primary" />,
							]}
						/>
						<DetailsGroup
							labels={["Domicilio", "Codigo Postal"]}
							content={[
								`${sucursal.domicilio!.calle} ${sucursal.domicilio!.numero}, ${
									sucursal.domicilio!.localidad!.nombre
								}, ${sucursal.domicilio!.localidad!.provincia!.nombre}.`,
								sucursal.domicilio!.cp!.toString(),
							]}
							icons={[
								<LocationOnRoundedIcon color="primary" />,
								<MyLocationRoundedIcon color="primary" />,
							]}
						/>
						{sucursal.domicilio!.piso ||
							(sucursal.domicilio!.nroDpto && (
								<DetailsGroup
									labels={labelsDpto}
									content={contentDpto}
									icons={[]}
								/>
							))}
					</Stack>
				</Stack>
				<IconButton
					sx={{ position: "absolute", right: 16, top: 16 }}
					onClick={handleClose}
				>
					<CloseIcon />
				</IconButton>
			</Stack>
		</Modal>
	);
};
