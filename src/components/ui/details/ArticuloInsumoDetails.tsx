import { FC, useState } from "react";
import { IArticuloInsumo } from "../../../types/empresa";
import {
	Box,
	Button,
	IconButton,
	MobileStepper,
	Modal,
	Stack,
	Typography,
} from "@mui/material";
import { modalStyle } from "../shared/GenericModal";
import { DetailsGroup } from "../shared/DetailsGroup";

import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import LiquorIcon from "@mui/icons-material/Liquor";
import ScaleIcon from "@mui/icons-material/Scale";
import SellIcon from "@mui/icons-material/Sell";

import RemoveShoppingCartRoundedIcon from "@mui/icons-material/RemoveShoppingCartRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import CloseIcon from "@mui/icons-material/Close";

import { theme } from "../../../styles/theme";

interface ArticuloInsumoDetailsProps {
	articuloInsumo: IArticuloInsumo;
	open: boolean;
	handleClose: () => void;
}

export const ArticuloInsumoDetails: FC<ArticuloInsumoDetailsProps> = ({
	articuloInsumo,
	open,
	handleClose,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const maxSteps = (articuloInsumo && articuloInsumo.imagenes?.length) ?? 0;

	const labelsPrecio = ["Unidad de medida", "Precio compra"];
	const contentPrecio = [
		articuloInsumo.unidadMedida!.denominacion,
		`$${articuloInsumo.precioCompra}`,
	];
	const iconsPrecio = [
		<ScaleIcon
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
	];
	if (articuloInsumo.precioVenta) {
		labelsPrecio.push("Precio venta");
		contentPrecio.push(`$${articuloInsumo.precioVenta}`);
		iconsPrecio.push(
			<AttachMoneyRoundedIcon
				sx={{
					color: theme.palette.bg.light,
					backgroundColor: theme.palette.primary.main,
					borderRadius: "50%",
					padding: "3px",
				}}
			/>
		);
	}

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
						{articuloInsumo.imagenes && articuloInsumo.imagenes.length > 0 && (
							<Box
								component="img"
								sx={{
									display: "block",
									maxWidth: 400,
									overflow: "hidden",
									borderTopLeftRadius: "20px",
									borderBottomRightRadius: 0,
									width: "100%",
								}}
								src={articuloInsumo.imagenes[activeStep].url}
								alt={articuloInsumo.imagenes[activeStep].name}
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
						alignItems="center"
					>
						<Typography variant="h4" sx={{fontSize: 18}}>Detalles del insumo</Typography>
						<DetailsGroup
							labels={["Nombre", "Categoria"]}
							content={[
								articuloInsumo.denominacion,
								articuloInsumo.categoria
									? articuloInsumo.categoria!.denominacion
									: "",
							]}
							icons={[
								<LiquorIcon
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
							labels={labelsPrecio}
							content={contentPrecio}
							icons={iconsPrecio}
						/>
						<DetailsGroup
							labels={["Stock actual", "Stock mínimo", "Stock máximo"]}
							content={[
								articuloInsumo.stockActual.toString(),
								articuloInsumo.stockMinimo.toString(),
								articuloInsumo.stockMaximo.toString(),
							]}
							icons={[
								<ShoppingCartIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,
								<RemoveShoppingCartRoundedIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,
								<AddShoppingCartIcon
									sx={{
										color: theme.palette.bg.light,
										backgroundColor: theme.palette.primary.main,
										borderRadius: "50%",
										padding: "3px",
									}}
								/>,
							]}
						/>
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
