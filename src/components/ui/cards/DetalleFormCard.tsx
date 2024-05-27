import { FC, useState } from "react";
import { IArticulo, IDetalle } from "../../../types/empresa";
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
import { emptyArticulo, emptyInsumo } from "../../../types/emptyEntities";
import { TextFieldStack } from "../styled/StyledForm";
import GenericModal from "../shared/GenericModal";
import { useAppSelector } from "../../../redux/hooks";
import { InsumoForm } from "../forms/InsumoForm";
import Pagination from "@mui/material/Pagination";
import { ArticuloCard } from "./ArticuloCard";

interface DetalleFormCardProps {
	detalle: IDetalle;
	onRemove: () => void;
	esInsumo: boolean;
}
export const DetalleFormCard: FC<DetalleFormCardProps> = ({
	detalle,
	onRemove,
	esInsumo,
}) => {
	const insumos = useAppSelector((state) => state.business.articulosInsumos);
	const manufacturados = useAppSelector(
		(state) => state.business.articulosManufacturados
	);

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
	const filteredManufacturados = manufacturados!.filter((manufacturado) =>
		manufacturado.denominacion.toLowerCase().includes(filter.toLowerCase())
	);

	const filteredArticulos = [
		...(esInsumo
			? filteredInsumos
			: filteredInsumos.filter((i) => !i.esParaElaborar)),
		...(esInsumo ? [] : filteredManufacturados),
	];

	const handleOpenModal = () => setOpenModal(true);

	const handleCloseModal = () => setOpenModal(false);

	const handleOpenInsumoModal = () => setOpenInsumoModal(true);

	const handleCloseInsumoModal = () => setOpenInsumoModal(false);

	const handleIncrement = () => {
		const newCantidad = cantidad + 1;
		setCantidad(newCantidad);
		detalle = { ...detalle, cantidad: newCantidad };
	};

	const handleDecrement = () => {
		if (cantidad > 0) {
			const newCantidad = cantidad - 1;
			setCantidad(newCantidad);
			detalle = { ...detalle, cantidad: newCantidad };
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		if (/^\d*\.?\d*$/.test(newValue)) {
			setCantidad(parseFloat(newValue));
			detalle.cantidad = parseFloat(newValue);
		}
	};

	const handleSelectArticulo = (articulo: IArticulo) => {
		detalle.articulo = articulo;
		handleCloseModal();
	};

	const itemsPerPage = 4;
	const [page, setPage] = useState(1);
	const noOfPages = Math.ceil(
		(filteredArticulos ? filteredArticulos.length : 0) / itemsPerPage
	);

	const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
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
								sx={{ width: "70px" }}
							/>
							<IconButton onClick={handleIncrement}>
								<AddIcon fontSize="small" />
							</IconButton>
						</Stack>
					</Stack>

					<Stack spacing={1} alignItems="center" width="100%">
						<Typography variant="h6">Unidad de medida</Typography>
						{detalle.articulo == emptyArticulo || !detalle.articulo ? (
							<Button
								variant="contained"
								size="small"
								sx={{ py: 1 }}
								onClick={() => handleOpenModal()}
							>
								Elegir artículo
							</Button>
						) : (
							<Stack
								direction="row"
								height="40px"
								alignItems="center"
								spacing={2}
							>
								<Chip label={detalle.articulo.unidadMedida?.denominacion} />
							</Stack>
						)}
					</Stack>
					<TextFieldStack spacing={1}>
						<Typography variant="h6">Artículo</Typography>
						{detalle.articulo !== emptyArticulo && detalle.articulo && (
							<Stack
								direction="row"
								height="40px"
								alignItems="center"
								spacing={2}
							>
								<Chip label={detalle.articulo!.denominacion} color="primary" />
							</Stack>
						)}
					</TextFieldStack>
					{!esInsumo && (
						<TextFieldStack spacing={1}>
							<Typography variant="h6">Precio</Typography>
							{detalle.articulo !== emptyArticulo && detalle.articulo && (
								<Stack
									direction="row"
									height="40px"
									alignItems="center"
									spacing={2}
								>
									<Chip label={`$${detalle.articulo!.precioVenta}`} />
								</Stack>
							)}
						</TextFieldStack>
					)}
				</Stack>
				<Tooltip title="Eliminar">
					<IconButton onClick={onRemove}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</Card>
			<GenericModal
				title="Elegir artículo"
				icon={<></>}
				open={openModal}
				handleClose={handleCloseModal}
			>
				<Stack spacing={2} width="100%" alignItems="center">
					<Stack
						direction="row"
						spacing={2}
						justifyContent="center"
						alignItems="center"
						width="50%"
					>
						<Typography>Buscar:</Typography>
						<TextField
							variant="outlined"
							value={filter}
							size="small"
							onChange={handleFilterChange}
							sx={{ width: "40%" }}
						/>
					</Stack>
					<Stack
						direction="row"
						spacing={3}
						justifyContent="center"
						width="100%"
						sx={{ marginX: "20px" }}
					>
						{filteredArticulos !== null ? (
							filteredArticulos
								.slice((page - 1) * itemsPerPage, page * itemsPerPage)
								.sort((a, b) => a.denominacion.localeCompare(b.denominacion))
								.map((articulo, index) => {
									if (
										(esInsumo &&
											"esParaElaborar" in articulo &&
											articulo.esParaElaborar) ||
										!esInsumo
									)
										return (
											<ArticuloCard
												onSelectArticulo={handleSelectArticulo}
												key={index}
												articulo={articulo}
											/>
										);
								})
						) : (
							<Typography>No hay artículos disponibles</Typography>
						)}
					</Stack>
					<Pagination count={noOfPages} page={page} onChange={handleChange} />
					{esInsumo && (
						<Button
							variant="contained"
							sx={{ width: "40%", alignSelf: "center", mt: 3 }}
							onClick={handleOpenInsumoModal}
						>
							Nuevo insumo
						</Button>
					)}
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
