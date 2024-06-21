import { BarChart } from "@mui/x-charts/BarChart";
import { FC } from "react";

interface GananciasBarChartValues {
	chartData: Object[][];
}

const GananciasBarChart: FC<GananciasBarChartValues> = ({ chartData }) => {

	let labels: string[] = [];
	let data: number[] = [];
	chartData.forEach((d, index) => {
		if (index !== 0) {
			labels.push(d[0] as string);
			data.push(d[1] as number);
		}
	});

	return (
		<BarChart
			xAxis={[
				{
					scaleType: "band",
					data: labels,
					colorMap: {
						type: "ordinal",
						colors: ["#3035c9", "#eb2f05", "#9987ff"],
					},
				},
			]}
			series={[{ data: data }]}
			width={480}
			height={280}
			sx={{ pl: 2 }}
		/>
	);
};

export default GananciasBarChart;
