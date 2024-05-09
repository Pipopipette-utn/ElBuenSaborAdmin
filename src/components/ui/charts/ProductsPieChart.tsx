import { PieChart } from "@mui/x-charts/PieChart";
/*
const data2 = [
	{ label: "Bebidas", value: 400 },
	{ label: "Hamburguesas", value: 300 },
	{ label: "Pizzas", value: 300 },
	{ label: "Postres", value: 200 },
	{ label: "Entradas", value: 200 },
];
*/

const data1 = [
	{ label: "Burger simple", value: 100, color: "#3035c9" },
	{ label: "Burger Messi", value: 100, color: "#eb2f05" },
	{ label: "Burger doble", value: 50, color: "#5d19e6" },
	{ label: "Pizza muzzarella", value: 300, color: "#9987ff" },
	{ label: "Pizza napolitana", value: 80, color: "#9f59f0" },
	{ label: "Coca cola", value: 40, color: "#FF5733" },
	{ label: "Cerveza Quilmes", value: 150, color: "#ff7e70" },
	{ label: "Papas fritas", value: 100, color: "#ffc2b3" },
];
/*
const series = [
	{
		innerRadius: 0,
		outerRadius: 80,
		id: "series-1",
		data: data1,
	},
	{
		innerRadius: 100,
		outerRadius: 120,
		id: "series-2",
		data: data2,
	},
];*/

const ProductsPieChart = () => {
	return (
		<PieChart
			sx={{ m: -2 }}
			series={[
				{
					data: data1,
					innerRadius: 30,
					outerRadius: 100,
					paddingAngle: 5,
					cornerRadius: 5,
					startAngle: -90,
					endAngle: 180,
					cx: 200,
					cy: 150,
				},
			]}
		/>
	);
};

export default ProductsPieChart;
