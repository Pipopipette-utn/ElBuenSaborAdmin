import {
	CircularProgress,
	Stack,
	Typography,
	Pagination,
	Select,
	MenuItem,
	IconButton,
	SelectChangeEvent,
	FormControl,
	InputLabel,
} from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RefreshIcon from "@mui/icons-material/Refresh";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useEffect, useState } from "react";
import { PedidoService } from "../../../services/PedidoService";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setPedidosSucursal } from "../../../redux/slices/SelectedData";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { IPedido } from "../../../types/empresa";
import PedidoCard from "../../ui/cards/PedidoCard";

const Pedidos = () => {
	const dispatch = useAppDispatch();
	const pedidosRedux = useAppSelector(
		(state) => state.selectedData.pedidosSucursal
	);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	const [loading, setLoading] = useState(false);
	const [pedidos, setPedidos] = useState<IPedido[]>(pedidosRedux ?? []);
	const [page, setPage] = useState(0);
	const [totalRows, setTotalRows] = useState(6);
	const [estado, setEstado] = useState<IPedido["estado"] | "">("");
	const itemsPerPage = 5;
	const pedidoService = new PedidoService("/pedidos");

	const fetchPedidos = async () => {
		if (sucursal !== null && !Array.isArray(sucursal)) {
			setLoading(true);
			try {
				const response = await pedidoService.getAllPagedBySucursal(
					sucursal.id!,
					page - 1,
					itemsPerPage,
					estado !== "" ? estado : undefined
				);
				setPedidos(response.data);
				setTotalRows(response.total);
				dispatch(setPedidosSucursal(response.data));
			} catch (error) {
				console.error("Error fetching pedidos:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		fetchPedidos();
	}, [sucursal, page, estado]);

	const handleReload = () => {
		setPage(0);
		fetchPedidos();
	};

	const noOfPages = Math.ceil(totalRows / itemsPerPage);

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

	const handleEstadoChange = (event: SelectChangeEvent) => {
		setEstado(event.target.value as IPedido["estado"] | "");
		setPage(1);
	};

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

	return (
		<>
			<GenericDoubleStack>
				<GenericHeaderStack
					icon={
						<AssignmentIcon
							color="primary"
							sx={{ width: "40px", height: "40px" }}
						/>
					}
					quantity={totalRows}
					activeEntities={"Pedidos activos"}
				>
					<Stack direction="row" width="100%" alignItems="center">
						<Typography variant="h6">Filtrar por estado:</Typography>
						<FormControl size="small" sx={{ width: "200px" }}>
							<InputLabel id="demo-simple-select-label">
								Estado del pedido
							</InputLabel>
							<Select
								value={estado}
								label="Tipo de categoría"
								onChange={handleEstadoChange}
								sx={{ width: "200px", fontSize: "14px" }}
							>
								<MenuItem value="">
									<em>Todos</em>
								</MenuItem>
								<MenuItem value="PREPARACION">En preparación</MenuItem>
								<MenuItem value="PENDIENTE">Pendiente</MenuItem>
								<MenuItem value="CANCELADO">Cancelado</MenuItem>
								<MenuItem value="RECHAZADO">Rechazado</MenuItem>
								<MenuItem value="ENTREGADO">Entregado</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</GenericHeaderStack>
				<Stack sx={{ p: "12px" }}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography variant="h5">Todos los pedidos</Typography>
						<IconButton onClick={handleReload}>
							<RefreshIcon color="primary" />
						</IconButton>
					</Stack>
					<Stack direction="column" width="100%" sx={{ p: "12px" }} spacing={2}>
						{loading ? (
							<CircularProgress sx={{ alignSelf: "center" }} />
						) : pedidos && pedidos.length === 0 ? (
							<Typography>Ups! No hay ningún pedido guardado.</Typography>
						) : (
							pedidos &&
							pedidos.map((pedido, index) => (
								<PedidoCard
									key={index}
									pedido={pedido}
									onShowSuccess={handleShowSuccess}
									onShowError={handleShowError}
								/>
							))
						)}
					</Stack>
					{pedidos && pedidos.length > 0 && (
						<Pagination
							count={noOfPages}
							page={page + 1}
							onChange={handlePageChange}
							sx={{ alignSelf: "center", mt: 2 }}
						/>
					)}
				</Stack>
			</GenericDoubleStack>
			<SuccessMessage
				open={!!showSuccess}
				onClose={handleCloseSuccess}
				message={showSuccess}
			/>
			<ErrorMessage
				open={!!showError}
				onClose={handleCloseError}
				message={showError}
			/>
		</>
	);
};

export default Pedidos;
