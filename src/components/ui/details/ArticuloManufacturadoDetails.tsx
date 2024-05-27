import { FC, useState } from "react";
import { IArticuloManufacturado } from "../../../types/empresa";
import {
	Box,
	Button,
	Grid,
	IconButton,
	MobileStepper,
	Modal,
	Stack,
} from "@mui/material";
import { modalStyle } from "../shared/GenericModal";
import { DetailsGroup, Header } from "../shared/DetailsGroup";

import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import LiquorIcon from "@mui/icons-material/Liquor";
import ScaleIcon from "@mui/icons-material/Scale";
import SellIcon from "@mui/icons-material/Sell";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NotesIcon from "@mui/icons-material/Notes";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import CloseIcon from "@mui/icons-material/Close";

import { theme } from "../../../styles/theme";

interface ArticuloManufacturadoDetailsProps {
	articuloManufacturado: IArticuloManufacturado;
	open: boolean;
	handleClose: () => void;
}

export const ArticuloManufacturadoDetails: FC<
	ArticuloManufacturadoDetailsProps
> = ({ articuloManufacturado, open, handleClose }) => {
	const [activeStep, setActiveStep] = useState(0);
	const maxSteps =
		(articuloManufacturado && articuloManufacturado.imagenes?.length) ?? 0;

	const handleNext = () => {
		setActiveStep((prevActiveStep) => {
			if (prevActiveStep + 1 < maxSteps) return prevActiveStep + 1;
			else return prevActiveStep;
		});
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => {
			if (prevActiveStep - 1 >= 0) return prevActiveStep - 1;
			else return prevActiveStep;
		});
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Stack width="100%" sx={modalStyle} alignItems="center">
				<Stack
					width="100%"
					height="100%"
					direction="row"
					alignItems="center"
					sx={{ borderRadius: "20px" }}
				>
					<Box sx={{ width: "500px", flexGrow: 1 }}>
						{articuloManufacturado.imagenes &&
							articuloManufacturado.imagenes.length > 0 && (
								<Box
									component="img"
									sx={{
										display: "block",
										maxWidth: 400,
										overflow: "hidden",
										width: "100%",
									}}
									src={articuloManufacturado.imagenes[activeStep].url}
									alt={articuloManufacturado.imagenes[activeStep].name}
								/>
							)}
						<MobileStepper
							steps={maxSteps}
							position="static"
							activeStep={activeStep}
							sx={{ borderRadius: "20px" }}
							nextButton={
								<Button
									size="small"
									onClick={handleNext}
									disabled={activeStep === maxSteps - 1}
								>
									{theme.direction === "rtl" ? (
										<KeyboardArrowLeft />
									) : (
										<KeyboardArrowRight />
									)}
								</Button>
							}
							backButton={
								<Button
									size="small"
									onClick={handleBack}
									disabled={activeStep === 0}
								>
									{theme.direction === "rtl" ? (
										<KeyboardArrowRight />
									) : (
										<KeyboardArrowLeft />
									)}
								</Button>
							}
						/>
					</Box>
					<Stack
						width="100%"
						spacing={2}
						padding="16px 10px"
						justifyContent="center"
					>
						<DetailsGroup
							labels={["Nombre", "Precio venta"]}
							content={[
								articuloManufacturado.denominacion,
								`$${articuloManufacturado.precioVenta}`,
							]}
							icons={[
								<FastfoodIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,

								<MonetizationOnIcon
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
							labels={["Unidad de medida", "Categoria"]}
							content={[
								articuloManufacturado.unidadMedida
									? articuloManufacturado.unidadMedida!.denominacion
									: "",
								articuloManufacturado.categoria
									? articuloManufacturado.categoria!.denominacion
									: "",
							]}
							icons={[
								<ScaleIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,

								<SellIcon
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
							labels={["Descripción"]}
							content={[articuloManufacturado.descripcion]}
							icons={[
								<NotesIcon
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
							labels={["Preparacion"]}
							content={[articuloManufacturado.preparacion]}
							icons={[
								<ReceiptLongIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,
							]}
						/>
						<Stack width="100%" sx={{ padding: "10px 24px" }} spacing={1}>
							<Stack direction="row" spacing={1}>
								<LiquorIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>
								<Header>Detalles</Header>
							</Stack>
							<Grid container sx={{ pl: 4 }} alignItems="center">
								{articuloManufacturado.articuloManufacturadoDetalles &&
									articuloManufacturado.articuloManufacturadoDetalles.map(
										(detalle, index) => (
											<Grid
												item
												xs={12}
												sm={6}
												md={4}
												key={index}
												height="100%"
											>
												<Stack direction="row" spacing={1}>
													<p>{detalle.cantidad}</p>
													{detalle.articuloInsumo &&
														"unidadMedida" in detalle.articuloInsumo && (
															<p>
																{
																	detalle.articuloInsumo.unidadMedida!
																		.denominacion
																}
															</p>
														)}

													{detalle.articuloInsumo &&
														"denominacion" in detalle.articuloInsumo && (
															<p>{detalle.articuloInsumo!.denominacion}</p>
														)}
												</Stack>
											</Grid>
										)
									)}
							</Grid>
						</Stack>
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
