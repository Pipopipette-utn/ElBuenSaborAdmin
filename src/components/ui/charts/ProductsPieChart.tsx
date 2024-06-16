import { PieChart } from "@mui/x-charts/PieChart";
import { FC } from "react";

interface ProductsPieChart {
	chartData: Object[][];
}

const ProductsPieChart: FC<ProductsPieChart> = ({ chartData }) => {
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

	let data: { label: string; value: number; color: string }[] = [];
	chartData.forEach((d, index) => {
		if (index !== 0)
			data.push({
				label: d[0] as string,
				value: d[1] as number,
				color: colors[index],
			});
	});

	return (
		<PieChart
			sx={{ mb: -4 }}
			series={[
				{
					data: data!,
					innerRadius: 30,
					outerRadius: 100,
					paddingAngle: 5,
					cornerRadius: 5,
					startAngle: -90,
					endAngle: 180,
					cx: 130,
					cy: 150,
					highlightScope: { faded: "global", highlighted: "item" },
					faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
				},
			]}
		/>
	);
};

export default ProductsPieChart;
