import { FC, useState } from "react";
import {
	IArticuloInsumo,
	IArticuloManufacturadoDetalle,
} from "../../../types/empresa";
import {
	Button,
	Chip,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { Card } from "../styled/StyledDetalleCard";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { emptyInsumo } from "../../../types/emptyEntities";
import { TextFieldStack } from "../styled/StyledForm";
import GenericModal from "../shared/GenericModal";
import { InsumoCard } from "./InsumoCard";
import { useAppSelector } from "../../../redux/hooks";
import { InsumoForm } from "../forms/InsumoForm";

interface DetalleFormCardProps {
	detalle: IArticuloManufacturadoDetalle;
	onRemove: () => void;
}
export const DetalleFormCard: FC<DetalleFormCardProps> = ({
	detalle,
	onRemove,
}) => {
	const insumos = useAppSelector((state) => state.business.articulosInsumos);

	const [cantidad, setCantidad] = useState(detalle.cantidad);
	const [openModal, setOpenModal] = useState(false);
	const [openInsumoModal, setOpenInsumoModal] = useState(false);

	const [filter, setFilter] = useState("");

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	// Filtrar los insumos basado en el valor del filtro
	const filteredInsumos = insumos!.filter((insumo) =>
		insumo.denominacion.toLowerCase().includes(filter.toLowerCase())
	);

	const handleOpenModal = () => setOpenModal(true);

	const handleCloseModal = () => setOpenModal(false);

	const handleOpenInsumoModal = () => setOpenInsumoModal(true);

	const handleCloseInsumoModal = () => setOpenInsumoModal(false);

	const handleIncrement = () => {
		setCantidad(cantidad + 1);
		detalle.cantidad = cantidad + 1;
	};

	const handleDecrement = () => {
		if (cantidad > 0) {
			setCantidad(cantidad - 1);
			detalle.cantidad = cantidad - 1;
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseFloat(event.target.value);
		setCantidad(newValue);
		detalle.cantidad = newValue;
	};

	const handleSelectInsumo = (insumo: IArticuloInsumo) => {
		detalle.articuloInsumo = insumo;
		handleCloseModal();
	};

	return (
		<>
			<Card>
				<Stack direction="row" spacing={2} width="100%">
					<Stack alignItems="center" spacing={1}>
						<Typography variant="h6">Cantidad</Typography>
						<Stack direction="row" alignItems="center">
							<IconButton onClick={handleDecrement}>
								<RemoveIcon fontSize="small" />
							</IconButton>
							<TextField
								size="small"
								variant="outlined"
								type="number"
								value={cantidad}
								inputProps={{ min: 0 }}
								onChange={handleInputChange}
								sx={{ width: "56px" }}
							/>
							<IconButton onClick={handleIncrement}>
								<AddIcon fontSize="small" />
							</IconButton>
						</Stack>
					</Stack>
					<Stack spacing={1} alignItems="center" width="100%">
						<Typography variant="h6">Unidad de medida</Typography>
						{detalle.articuloInsumo == emptyInsumo ||
						!detalle.articuloInsumo ? (
							<Button
								variant="contained"
								size="small"
								sx={{ py: 1 }}
								onClick={() => handleOpenModal()}
							>
								Elegir insumo
							</Button>
						) : (
							<Stack
								direction="row"
								height="40px"
								alignItems="center"
								spacing={2}
							>
								<Chip
									label={detalle.articuloInsumo.unidadMedida?.denominacion}
								/>
							</Stack>
						)}
					</Stack>
					<TextFieldStack spacing={1}>
						<Typography variant="h6">Insumo</Typography>
						{detalle.articuloInsumo !== emptyInsumo &&
							detalle.articuloInsumo && (
								<Stack
									direction="row"
									height="40px"
									alignItems="center"
									spacing={2}
								>
									<Chip
										label={detalle.articuloInsumo!.denominacion}
										color="primary"
									/>
								</Stack>
							)}
					</TextFieldStack>
				</Stack>
				<Tooltip title="Eliminar">
					<IconButton onClick={onRemove}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</Card>
			<GenericModal
				title="Elegir insumo"
				icon={<></>}
				open={openModal}
				handleClose={handleCloseModal}
			>
				<Stack spacing={2}>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="center"
						alignItems="center"
					>
						<Typography>Buscar:</Typography>
						<TextField
							variant="outlined"
							value={filter}
							onChange={handleFilterChange}
							sx={{ width: "40%" }}
						/>
					</Stack>
					<Stack
						direction="row"
						spacing={3}
						justifyContent="center"
						sx={{ overflowX: "wrap" }}
					>
						{filteredInsumos !== null ? (
							filteredInsumos
								.filter((insumo) => insumo.esParaElaborar == true)
								.sort((a, b) => a.denominacion.localeCompare(b.denominacion))
								.map((i: IArticuloInsumo, index: number) => (
									<InsumoCard
										onSelectInsumo={handleSelectInsumo}
										key={index}
										insumo={i}
									/>
								))
						) : (
							<></>
						)}
					</Stack>
					<Button
						variant="contained"
						sx={{ width: "40%", alignSelf: "center", mt: 3 }}
						onClick={handleOpenInsumoModal}
					>
						Nuevo insumo
					</Button>
				</Stack>
			</GenericModal>
			<GenericModal
				title={"Crear insumo"}
				icon={<></>}
				open={openInsumoModal}
				handleClose={handleCloseInsumoModal}
			>
				<InsumoForm
					initialArticuloInsumo={emptyInsumo}
					onClose={handleCloseInsumoModal}
				/>
			</GenericModal>
		</>
	);
};
