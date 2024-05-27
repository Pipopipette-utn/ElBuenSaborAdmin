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
	esInsumo: boolean;
	precioInicial?: number;
}

export const DetalleFormCardList: FC<DetalleFormCardListProps> = ({
	detallesArticulo,
	onBack,
	onSubmit,
	submitButtonText,
	esInsumo,
	precioInicial,
}) => {
	const [detalles, setDetalles] = useState<IDetalle[]>(detallesArticulo);
	const [precioPromocional, setPrecioPromocional] = useState(
		precioInicial ?? 0
	);

	useEffect(() => {
		if (!precioInicial) {

			const precio = detalles.reduce(
				(precio, detalle) => {
					console.log(detalle);
					console.log(precio);
					return (
						precio + detalle.cantidad * (detalle.articulo?.precioVenta || 0)
					);
				},
				0 // Valor inicial para 'precio'
			);
			console.log(precio);
			setPrecioPromocional(precio);
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

	return (
		<Stack width="80%" spacing={3} alignItems="center">
			{!esInsumo && (
				<TextFieldStack spacing={1}>
					<Typography>
						Precio promocional:
						<span style={{ color: "red" }}> *</span>
					</Typography>
					<TextField
						type="number"
						name="precioPromocional"
						fullWidth
						placeholder={"Precio promocional"}
						onChange={(event) =>
							setPrecioPromocional(parseFloat(event.target.value))
						}
						value={precioPromocional}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MonetizationOnIcon />
								</InputAdornment>
							),
						}}
					/>
				</TextFieldStack>
			)}
			<Stack spacing={2} width="100%">
				{detalles.map((detalle, index) => (
					<DetalleFormCard
						key={index}
						detalle={detalle}
						onRemove={() => handleRemoveDetalle(index)}
						esInsumo={esInsumo}
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
