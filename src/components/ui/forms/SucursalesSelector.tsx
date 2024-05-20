import { FC, useState } from "react";
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Button,
	Stack,
	Typography,
} from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";

interface SucursalSelectorProps {
	onBack: () => void;
	handleSubmit: (sucursalesIds: number[]) => void;
	buttonTitle: string;
}

export const SucursalesSelector: FC<SucursalSelectorProps> = ({
	onBack,
	handleSubmit,
	buttonTitle,
}) => {
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);
	const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

	const handleToggle = (id: number) => {
		setSelectedSucursales((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((sucursalId) => sucursalId !== id)
				: [...prevSelected, id]
		);
		console.log(id);
	};

	return (
		<>
			<FormControl component="fieldset">
				<FormLabel component="legend">
					<Typography variant="h5" sx={{mb: 2, fontSize: 18}}>
						¿En qué sucursales quieres aplicar los cambios?
					</Typography>
				</FormLabel>
				<FormGroup>
					{sucursales &&
						sucursales.map((sucursal, index) => (
							<FormControlLabel
								key={index}
								control={
									<Checkbox
										checked={selectedSucursales.includes(sucursal.id!)}
										onChange={() => handleToggle(sucursal.id!)}
										name={sucursal.nombre}
									/>
								}
								label={sucursal.nombre}
							/>
						))}
				</FormGroup>
			</FormControl>
			<Stack direction="row" width="80%" spacing={2}>
				<Button
					variant="outlined"
					sx={{ py: 1, px: 4, textTransform: "uppercase" }}
					onClick={onBack}
				>
					Volver
				</Button>
				<Button
					variant="contained"
					type="submit"
					fullWidth
					sx={{ py: 1.5, px: 4, textTransform: "uppercase" }}
					onClick={() => handleSubmit(selectedSucursales)}
				>
					{buttonTitle}
				</Button>
			</Stack>
		</>
	);
};
