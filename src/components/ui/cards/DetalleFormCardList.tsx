import {
	Button,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { IDetalle } from "../../../types/empresa";
import { FC, useEffect, useState } from "react";
import { DetalleFormCard } from "./DetalleFormCard";
import { emptyArticulo } from "../../../types/emptyEntities";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextFieldStack } from "../styled/StyledForm";

interface DetalleFormCardListProps {
	detallesArticulo: IDetalle[];
	onBack: () => void;
	onSubmit: (d: IDetalle[], precio?: number) => void;
	submitButtonText: string;
	esPromocion: boolean;
	precioInicial?: number;
	precioVenta?: number;
}

export const DetalleFormCardList: FC<DetalleFormCardListProps> = ({
	detallesArticulo,
	onBack,
	onSubmit,
	submitButtonText,
	esPromocion,
	precioInicial,
	precioVenta,
}) => {
	const [detalles, setDetalles] = useState<IDetalle[]>(detallesArticulo);
	const [precioPromocional, setPrecioPromocional] = useState(
		precioInicial ?? 0
	);
	const [ganancia, setGanancia] = useState(precioVenta ?? 0);

	useEffect(() => {
		if (precioInicial == 0) {
			const precio = detalles.reduce(
				(precio, detalle) => {
					return (
						precio + detalle.cantidad * (detalle.articulo?.precioVenta || 0)
					);
				},
				0 // Valor inicial para 'precio'
			);
			setPrecioPromocional(precio);
		}
		if (precioVenta) {
			const costo = detalles.reduce(
				(costo, detalle) => {
					if ("precioCompra" in detalle.articulo!) {
						return costo + detalle.cantidad * detalle.articulo.precioCompra;
					} else {
						return costo;
					}
				},
				0 // Valor inicial para 'precio'
			);
			setGanancia(precioVenta - costo);
		}
	}, [detalles]);

	const handleAddDetalle = () => {
		const newDetalle = {
			baja: false,
			cantidad: 0,
			articulo: emptyArticulo,
		};
		setDetalles([...detalles, newDetalle]);
	};

	const handleRemoveDetalle = (index: number) => {
		setDetalles(detalles.filter((_, i) => i !== index));
	};

	const handleUpdateDetalle = (index: number, updatedDetalle: IDetalle) => {
		setDetalles(
			detalles.map((detalle, i) => (i === index ? updatedDetalle : detalle))
		);
	};

	return (
		<Stack width="80%" spacing={3} alignItems="center">
			{esPromocion ||
				(precioVenta && (
					<TextFieldStack spacing={1}>
						<Typography>
							{esPromocion ? "Precio promocional:" : "Ganancia"}
							{esPromocion && <span style={{ color: "red" }}> *</span>}
						</Typography>
						<TextField
							type="number"
							name={esPromocion ? "precioPromocional" : "ganancia"}
							fullWidth
							placeholder={"Precio promocional"}
							onChange={(event) =>
								setPrecioPromocional(parseFloat(event.target.value))
							}
							disabled={!esPromocion}
							value={esPromocion ? precioPromocional : ganancia}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<MonetizationOnIcon />
									</InputAdornment>
								),
							}}
						/>
					</TextFieldStack>
				))}
			<Stack spacing={2} width="100%">
				{detalles.map((detalle, index) => (
					<DetalleFormCard
						key={index}
						detalle={detalle}
						onRemove={() => handleRemoveDetalle(index)}
						onUpdate={(updatedDetalle) =>
							handleUpdateDetalle(index, updatedDetalle)
						}
						esInsumo={!esPromocion}
					/>
				))}
			</Stack>
			<Tooltip color="primary" title="Agregar detalle">
				<IconButton
					size="medium"
					onClick={handleAddDetalle}
					sx={{ width: "40px" }}
				>
					<AddCircleOutlineIcon fontSize="medium" />
				</IconButton>
			</Tooltip>
			<Stack direction="row" width="100%" spacing={2}>
				{onBack && (
					<Button
						variant="outlined"
						sx={{ py: 1, px: 4, textTransform: "uppercase" }}
						onClick={onBack}
					>
						Volver
					</Button>
				)}
				<Button
					variant="contained"
					type="submit"
					disabled={detalles.length == 0}
					fullWidth
					sx={{ py: 1.5, px: 4, textTransform: "uppercase" }}
					onClick={(event) => {
						event.preventDefault();
						onSubmit(detalles, precioPromocional);
					}}
				>
					{submitButtonText}
				</Button>
			</Stack>
		</Stack>
	);
};
