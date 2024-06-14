import { FC, useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Stack,
	Chip,
	Select,
	MenuItem,
} from "@mui/material";
import { IPedido } from "../../../types/empresa";
import { PedidoService } from "../../../services/PedidoService";
import { editPedidoSucursal } from "../../../redux/slices/SelectedData";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import TodayIcon from "@mui/icons-material/Today";
import PaidIcon from "@mui/icons-material/Paid";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PaymentsIcon from "@mui/icons-material/Payments";
import { theme } from "../../../styles/theme";
import { Estado, estadoOptions } from "../../../types/enums";
import { AlertDialog } from "../shared/AlertDialog";

interface PedidoCardProps {
	pedido: IPedido;
	onShowSuccess: (s: string) => void;
	onShowError: (s: string) => void;
}

const PedidoCard: FC<PedidoCardProps> = ({
	pedido,
	onShowSuccess,
	onShowError,
}) => {
	const pedidoService = new PedidoService("/pedidos");
	const [selectedEstado, setSelectedEstado] = useState(pedido.estado as string);
	const [open, setOpen] = useState(false);
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const updateEstado = async (estado: string) => {
		try {
			const formattedEstado =
				estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
			const estadoEnum = Estado[formattedEstado as keyof typeof Estado];

			// Validaciones
			if (
				(selectedEstado === "PREPARACION" && estadoEnum === Estado.Pendiente) ||
				(["PENDIENTE", "CANCELADO", "RECHAZADO"].includes(selectedEstado) &&
					estadoEnum === Estado.Delivery) ||
				(["PENDIENTE", "CANCELADO", "RECHAZADO"].includes(selectedEstado) &&
					estadoEnum === Estado.Entregado)
			) {
				throw new Error(
					`El estado del pedido no puede pasar de ${selectedEstado} a  ${estado}`
				);
			}

			const newPedido = await pedidoService.updateEstado(
				pedido.id!,
				estadoEnum
			);
			dispatch(editPedidoSucursal(newPedido));
			onShowSuccess("Estado del pedido actualizado con éxito!");
			setSelectedEstado(estado as IPedido["estado"]);
		} catch (error) {
			onShowError("" + error);
		}
	};

	const handleChangeEstado = (estado: string) => {
		if (estado === "CANCELADO") {
			handleClickOpen();
		} else {
			updateEstado(estado);
		}
	};

	return (
		<>
			<Card>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Pedido #{pedido.id}
					</Typography>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-around"
						spacing={2}
					>
						<Stack spacing={1} marginTop={1}>
							<Stack spacing={1} direction="row" alignItems="center">
								<TodayIcon fontSize="small" />
								<Typography>
									{new Date(pedido.fechaPedido).toLocaleString()}
								</Typography>
							</Stack>
							<Stack spacing={1} direction="row" alignItems="center">
								<PaidIcon fontSize="small" />
								<Typography>${pedido.total}</Typography>
							</Stack>
						</Stack>
						<Stack spacing={1} marginTop={1}>
							<Stack spacing={1} direction="row" alignItems="center">
								<PaymentsIcon fontSize="small" />
								<Typography>
									{pedido.formaPago.toLowerCase().replace(/_/g, " ")}
								</Typography>
							</Stack>
							<Stack spacing={1} direction="row" alignItems="center">
								<DeliveryDiningIcon fontSize="small" />
								<Typography>
									{pedido.tipoEnvio.toLowerCase().replace(/_/g, " ")}
								</Typography>
							</Stack>
						</Stack>
						<Stack spacing={1} alignItems="center">
							<Typography variant="h6" sx={{ fontWeight: "bold" }}>
								Detalles
							</Typography>
							{pedido.detallePedidos.map((detalle, index) => (
								<Chip
									key={index}
									label={`${detalle.cantidad} x ${detalle.articulo.denominacion}`}
								/>
							))}
						</Stack>
						<Stack alignItems="center" justifyContent="center" spacing={1}>
							<Typography variant="h6" sx={{ fontWeight: "bold" }}>
								Estado
							</Typography>
							<Select
								size="small"
								labelId={`estado-label-${pedido.id}`}
								value={selectedEstado}
								disabled={selectedEstado === "CANCELADO"}
								onChange={(e) => handleChangeEstado(e.target.value)}
								sx={{
									backgroundColor:
										selectedEstado === "ENTREGADO"
											? theme.palette.success.main
											: selectedEstado === "CANCELADO"
											? theme.palette.bg.dark
											: theme.palette.primary.main,
									fontSize: "14px",
									color: "white",
									borderRadius: "30px",
									paddingX: 1,
									paddingY: 0.5,
								}}
							>
								{estadoOptions.map(({ key, label }) => (
									<MenuItem
										key={key}
										value={label.toUpperCase()}
										disabled={
											user!.rol! === "DELIVERY" && key !== 4 && key !== 5
										}
									>
										{label}
									</MenuItem>
								))}
							</Select>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
			<AlertDialog
				open={open}
				title={"¿Estás seguro que quieres cancelar el pedido?"}
				content={"El stock de los artículos se recuperará."}
				onAgreeClose={() => {
					handleClose();
					updateEstado("CANCELADO");
				}}
				onDisagreeClose={handleClose}
			/>
		</>
	);
};

export default PedidoCard;
