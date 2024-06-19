import { Button, Stack, Typography } from "@mui/material";
import { ReportStack, StyledStack } from "../../ui/styled/StyledStack";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import TodayIcon from "@mui/icons-material/Today";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { ReportAmount, ReportTitle } from "../../ui/styled/Typography";
import { useEffect, useState } from "react";
import ProductsPieChart from "../../ui/charts/ProductsPieChart";
import { useAppSelector } from "../../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { PedidoService } from "../../../services/PedidoService";
import dayjs, { Dayjs } from "dayjs";
import GananciasBarChart from "../../ui/charts/BarChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Home = () => {
	const pedidoService = new PedidoService("/pedidos");
	const user = useAppSelector((state) => state.auth.user);
	const empleado = useAppSelector((state) => state.auth.empleado);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const navigate = useNavigate();

	const [fechaDesde, setFechaDesde] = useState<Dayjs>(dayjs().startOf("year"));
	const [fechaHasta, setFechaHasta] = useState<Dayjs>(dayjs().endOf("year"));

	const [pieChartData, setPieChartData] = useState<Object[][]>([]);
	const [barChartData, setBarChartData] = useState<Object[][]>([]);

	const [recaudadoDia, setRecaudadoDia] = useState<number>(0);
	const [recaudadoSemana, setRecaudadoSemana] = useState<number>(0);
	const [recaudadoMes, setRecaudadoMes] = useState<number>(0);

	const formatter = new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		minimumFractionDigits: 2,
	});

	useEffect(() => {
		const getRecaudado = async () => {
			const recaudadoHoy = await pedidoService.getRecaudadoDia(
				dayjs().format("YYYY-MM-DD"),
				dayjs().format("YYYY-MM-DD"),
				sucursal!.id!
			);
			const recaudadoSemana = await pedidoService.getRecaudadoDia(
				dayjs().startOf("week").format("YYYY-MM-DD"),
				dayjs().endOf("week").format("YYYY-MM-DD"),
				sucursal!.id!
			);
			const recaudadoMes = await pedidoService.getRecaudadoMes(sucursal!.id!);
			if (recaudadoHoy.length > 1) {
				setRecaudadoDia(recaudadoHoy[1][1] as number);
			} else {
				setRecaudadoDia(0);
			}
			if (recaudadoSemana.length > 1) {
				setRecaudadoSemana(recaudadoSemana[1][1] as number);
			} else {
				setRecaudadoSemana(0);
			}
			if (recaudadoMes.length > 1) {
				setRecaudadoMes(recaudadoMes[1][1] as number);
			} else {
				setRecaudadoMes(0);
			}
		};
		if (sucursal) {
			getRecaudado();
		}
	}, [sucursal]);

	useEffect(() => {
		const getRankingComidas = async () => {
			const desde = fechaDesde.format("YYYY-MM-DD");
			const hasta = fechaHasta.format("YYYY-MM-DD");

			const rankingComidas = await pedidoService.getRankingComidas(
				desde,
				hasta,
				sucursal!.id!
			);
			setPieChartData(rankingComidas);
		};
		const getGanancias = async () => {
			const desde = fechaDesde.format("YYYY-MM-DD");
			const hasta = fechaHasta.format("YYYY-MM-DD");

			let totalGanancias;
			if (fechaDesde.month() === fechaHasta.month()) {
				totalGanancias = await pedidoService.getGananciasDiarias(
					desde,
					hasta,
					sucursal!.id!
				);
			} else {
				totalGanancias = await pedidoService.getGananciasMensual(
					desde,
					hasta,
					sucursal!.id!
				);
			}
			setBarChartData(totalGanancias);
		};
		if (sucursal) {
			getRankingComidas();
			getGanancias();
		}
	}, [sucursal, fechaDesde, fechaHasta]);

	return (
		<StyledStack
			spacing={2}
			minHeight="100%"
			sx={{ borderRadius: 0 }}
			justifyContent="center"
			alignItems="center"
			width="100%"
		>
			{["SUPERADMIN", "ADMIN", "CAJERO"].includes(user!.rol!) ? (
				<>
					<Stack direction="row" spacing={3} width="100%">
						<ReportStack spacing={2}>
							<Stack direction="row" spacing={1} alignItems="center">
								<EditCalendarIcon fontSize="medium" />
								<Typography>Aplicar filtros</Typography>
							</Stack>
							<Stack direction="row" spacing={1} alignItems="center">
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										format="DD/MM/YYYY"
										label="Fecha desde"
										maxDate={fechaHasta}
										sx={{ maxWidth: "150px" }}
										value={fechaDesde}
										onChange={(newValue) => setFechaDesde(dayjs(newValue))}
									/>
									<DatePicker
										format="DD/MM/YYYY"
										label="Fecha hasta"
										minDate={fechaDesde}
										sx={{ maxWidth: "150px" }}
										value={fechaHasta}
										onChange={(newValue) => setFechaHasta(dayjs(newValue))}
									/>
								</LocalizationProvider>
							</Stack>
						</ReportStack>
						<ReportStack spacing={1} flexGrow={1}>
							<TodayIcon fontSize="large" />
							<ReportAmount>{formatter.format(recaudadoDia)}</ReportAmount>
							Recaudado hoy
						</ReportStack>
						<ReportStack spacing={1} flexGrow={1}>
							<DateRangeIcon fontSize="large" />
							<ReportAmount>{formatter.format(recaudadoSemana)}</ReportAmount>
							Recaudado esta semana
						</ReportStack>
						<ReportStack spacing={1} flexGrow={1}>
							<CalendarTodayIcon fontSize="large" />
							<ReportAmount>{formatter.format(recaudadoMes)}</ReportAmount>
							Recaudado este mes
						</ReportStack>
					</Stack>
					<Stack direction="row" spacing={3} width="100%" height="100%">
						<Stack
							spacing={2}
							width="45%"
							height="100%"
							justifyContent="center"
						>
							<ReportStack spacing={2} alignItems="center" height="100%">
								<ReportTitle>Ganancias</ReportTitle>
								<GananciasBarChart chartData={barChartData} />
							</ReportStack>
						</Stack>

						<ReportStack spacing={-3} alignItems="center" width="55%">
							<ReportTitle>Productos más vendidos</ReportTitle>
							<ProductsPieChart chartData={pieChartData} />
						</ReportStack>
					</Stack>
				</>
			) : (
				<Stack width="100%" alignItems="center" spacing={2} padding={2}>
					<ReportTitle>
						Bienvenido {empleado!.nombre} {empleado!.apellido}
					</ReportTitle>
					<Typography variant="h6" align="center">
						Esta es tu sección personalizada.
					</Typography>
					<Stack direction="row" spacing={3} alignItems="center">
						{user!.rol === "COCINERO" && (
							<Stack alignItems="center">
								<SoupKitchenIcon fontSize="large" />
								<Typography variant="subtitle1">Panel del Cocinero</Typography>
								<Stack direction="row" spacing={2} marginTop={2} width="100%">
									<Button
										variant="contained"
										color="primary"
										sx={{ flex: 1 }}
										onClick={() => {
											navigate("/articulos/insumos");
										}}
									>
										Ver artículos insumos
									</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ flex: 1 }}
										onClick={() => {
											navigate("/articulos/manufacturados");
										}}
									>
										Ver artículos manufacturados
									</Button>
								</Stack>
							</Stack>
						)}
						{user!.rol === "DELIVERY" && (
							<Stack alignItems="center">
								<TwoWheelerIcon fontSize="large" />
								<Typography variant="subtitle1">Panel de Delivery</Typography>
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										navigate("/pedidos");
									}}
								>
									Ver pedidos
								</Button>
							</Stack>
						)}
					</Stack>
				</Stack>
			)}
		</StyledStack>
	);
};

export default Home;
