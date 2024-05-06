import { Divider, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
	ContainerStack,
	ReportStack,
	StyledStack,
} from "../../ui/styled/StyledStack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TodayIcon from "@mui/icons-material/Today";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
	ReportAmount,
	ReportSubtitle,
	ReportTitle,
} from "../../ui/styled/Typography";
import { useState } from "react";
import ProductsPieChart from "../../ui/charts/ProductsPieChart";

export const Home = () => {
	const [month, setMonth] = useState<string | null>("may");

	const handleMonth = (
		event: React.MouseEvent<HTMLElement>,
		newMonth: string | null
	) => {
		setMonth(newMonth);
	};

	return (
			<StyledStack height="90vh" spacing={2} sx={{borderRadius: 0}}>
				<Stack direction="row" spacing={3} width="100%">
					<ReportStack spacing={1} flexGrow={1}>
						<CalendarTodayIcon fontSize="large" />
						<ReportAmount>$0.000,00</ReportAmount>
						Recaudado hoy
					</ReportStack>
					<ReportStack spacing={1} flexGrow={1}>
						<DateRangeIcon fontSize="large" />
						<ReportAmount>$00.000,00</ReportAmount>
						Recaudado esta semana
					</ReportStack>
					<ReportStack spacing={1} flexGrow={1}>
						<TodayIcon fontSize="large" />
						<ReportAmount>$000.000,00</ReportAmount>
						Recaudado este mes
					</ReportStack>
				</Stack>
				<Stack direction="row" spacing={3} width="100%">
					<Stack spacing={2} width="40%">
						<ReportStack spacing={2} alignItems="center">
							<ReportTitle>Ganancias</ReportTitle>
							<Stack direction="row" spacing={2}>
								<Stack alignItems="center">
									<ReportSubtitle>Costos</ReportSubtitle>
									<ReportAmount>$00.000,00</ReportAmount>
								</Stack>
								<Divider orientation="vertical" />
								<Stack alignItems="center">
									<ReportSubtitle>Ventas</ReportSubtitle>
									<ReportAmount>$00.000,00</ReportAmount>
								</Stack>
							</Stack>
							<ToggleButtonGroup value={month} exclusive onChange={handleMonth}>
								<ToggleButton value="january">J</ToggleButton>
								<ToggleButton value="february">F</ToggleButton>
								<ToggleButton value="march">M</ToggleButton>
								<ToggleButton value="april">A</ToggleButton>
								<ToggleButton value="may">M</ToggleButton>
								<ToggleButton value="june">J</ToggleButton>
								<ToggleButton value="july">J</ToggleButton>
								<ToggleButton value="agost">A</ToggleButton>
								<ToggleButton value="september">S</ToggleButton>
								<ToggleButton value="october">O</ToggleButton>
								<ToggleButton value="november">N</ToggleButton>
								<ToggleButton value="december">D</ToggleButton>
							</ToggleButtonGroup>
						</ReportStack>

						<Stack direction="row" spacing={2.5} width="100%">
							<ReportStack direction="row" spacing={2} alignItems="center">
								<GroupsIcon fontSize="large" />
								<Stack padding="0">
									<ReportTitle sx={{ lineHeight: "20px" }}>
										Nuevos clientes
									</ReportTitle>
									<ReportAmount fontWeight="bolder">10+</ReportAmount>
								</Stack>
							</ReportStack>
							<ReportStack direction="row" spacing={2} alignItems="center">
								<PeopleAltIcon fontSize="large" />
								<Stack padding="0">
									<ReportTitle sx={{ lineHeight: "20px" }}>
										Empleados activos
									</ReportTitle>
									<ReportAmount fontWeight="bolder">8</ReportAmount>
								</Stack>
							</ReportStack>
						</Stack>
					</Stack>

					<ReportStack spacing={-3} alignItems="center" width="60%">
						<ReportTitle>Productos más vendidos</ReportTitle>
						<ProductsPieChart />
					</ReportStack>
				</Stack>
			</StyledStack>
	);
};
