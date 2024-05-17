import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { IArticuloManufacturadoDetalle } from "../../../types/empresa";
import { FC, useState } from "react";
import { DetalleFormCard } from "./DetalleFormCard";
import { emptyInsumo } from "../../../types/emptyEntities";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface DetalleFormCardListProps {
	detallesArticulo: IArticuloManufacturadoDetalle[];
	onBack: () => void;
	onSubmit: (d: IArticuloManufacturadoDetalle[]) => void;
	submitButtonText: string;
}

export const DetalleFormCardList: FC<DetalleFormCardListProps> = ({
	detallesArticulo,
	onBack,
	onSubmit,
	submitButtonText,
}) => {
	const [detalles, setDetalles] = useState(detallesArticulo);

	const handleAddDetalle = () => {
		const newDetalle = {
			baja: false,
			cantidad: 0,
			articuloInsumo: emptyInsumo,
		};
		setDetalles([...detalles, newDetalle]);
	};

	const handleRemoveDetalle = (index: number) => {
		setDetalles(detalles.filter((_, i) => i !== index));
	};

	return (
		<Stack width="80%" spacing={1}>
			<Stack spacing={2}>
				{detalles.map((detalle, index) => (
					<DetalleFormCard
						key={index}
						detalle={detalle}
						onRemove={() => handleRemoveDetalle(index)}
					/>
				))}
			</Stack>
			<Tooltip color="primary" title="Agregar detalle">
				<IconButton size="medium" onClick={handleAddDetalle}>
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
					fullWidth
					sx={{ py: 1.5, px: 4, textTransform: "uppercase" }}
					onClick={(event) => {
						event.preventDefault();
						onSubmit(detalles);
					}}
				>
					{submitButtonText}
				</Button>
			</Stack>
		</Stack>
	);
};
