import { BarChart } from "@mui/x-charts/BarChart";
import { FC } from "react";

interface GananciasBarChartValues {
	chartData: Object[][];
}

const GananciasBarChart: FC<GananciasBarChartValues> = ({ chartData }) => {
	const colors = [
		"#3035c9",
		"#eb2f05",
		"#5d19e6",
		"#9987ff",
		"#9f59f0",
		"#FF5733",
		"#ff7e70",
		"#ffc2b3",
		"#eb2f05",
		"#3035c9",
	];

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
