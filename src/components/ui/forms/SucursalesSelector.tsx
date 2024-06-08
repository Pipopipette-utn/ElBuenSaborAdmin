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
	Tooltip,
} from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { ISucursal } from "../../../types/empresa";
import { ISucursalDTO } from "../../../types/dto";

interface SucursalSelectorProps {
	selected: ISucursalDTO[];
	onBack?: () => void;
	handleSubmit: (selectedSucursales: ISucursalDTO[]) => void;
	buttonTitle: string;
}

export const SucursalesSelector: FC<SucursalSelectorProps> = ({
	selected,
	onBack,
	handleSubmit,
	buttonTitle,
}) => {
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
	);
	const [disabled, setDisabled] = useState(false);
	const [selectedSucursales, setSelectedSucursales] = useState<
		ISucursal[] | ISucursalDTO[]
	>(selected);

	const handleToggle = (sucursal: ISucursal) => {
		setSelectedSucursales((prevSelected) =>
			prevSelected.includes(sucursal)
				? prevSelected.filter((s) => sucursal.id !== s.id)
				: [...prevSelected, sucursal]
		);
	};

	return (
		<>
			<FormControl component="fieldset">
				<FormLabel component="legend">
					<Typography variant="h5" sx={{ mb: 2, fontSize: 18 }}>
						¿En qué sucursales quieres aplicar los cambios?
					</Typography>
				</FormLabel>
				<FormGroup>
					{Array.isArray(sucursales) &&
						sucursales.map((sucursal, index) => {
							const estaActiva =
								selectedSucursales.find((s) => s.id! === sucursal.id!) !==
								undefined;

							const estaDeshabilitada =
								selected.find((s) => s.id! === sucursal.id!) !== undefined;

							return (
								<Tooltip
									key={index}
									title={
										estaActiva && estaDeshabilitada
											? `Para dar de baja en una sucursal, hacerlo desde el botón "Dar de baja"`
											: ""
									}
									arrow
								>
									<FormControlLabel
										key={index}
										control={
											<Checkbox
												checked={estaActiva}
												disabled={estaDeshabilitada}
												onChange={() => handleToggle(sucursal)}
												name={sucursal.nombre}
											/>
										}
										label={sucursal.nombre}
									/>
								</Tooltip>
							);
						})}
				</FormGroup>
			</FormControl>
			<Stack direction="row" width="80%" spacing={2}>
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
					disabled={disabled}
					type="submit"
					fullWidth
					sx={{ py: 1.5, px: 4, textTransform: "uppercase" }}
					onClick={() => {
						setDisabled(true);
						handleSubmit(selectedSucursales);
					}}
				>
					{buttonTitle}
				</Button>
			</Stack>
		</>
	);
};
