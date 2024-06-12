import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SellIcon from "@mui/icons-material/Sell";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";
import ScaleIcon from "@mui/icons-material/Scale";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export type MenuItem = {
	label: string;
	icon?: React.ElementType<any>;
	subcategories?: MenuItem[];
};

export const getListItemsByRol = (rol: string): MenuItem[] => {
	switch (rol) {
		case "SUPERADMIN":
		case "ADMIN":
			return listItemsAdmin;
		case "CAJERO":
			return listItemsCajero;
		case "DELIVERY":
			return listItemsDelivery;
		case "COCINERO":
			return listItemsCocinero;
		default:
			return [];
	}
	listItemsAdmin;
};

const listItemsAdmin: MenuItem[] = [
	{ label: "Inicio", icon: HomeIcon },
	{ label: "Sucursales", icon: StoreIcon },
	{
		label: "Articulos",
		icon: LocalMallIcon,
		subcategories: [{ label: "Insumos" }, { label: "Manufacturados" }],
	},
	{ label: "Categorias", icon: SellIcon },
	{ label: "Promociones", icon: PercentIcon },
	{ label: "Pedidos", icon: ShoppingCartIcon },

	{
		label: "Empleados",
		icon: PersonIcon,
	},
	{ label: "Unidades de medida", icon: ScaleIcon },
];

const listItemsCocinero: MenuItem[] = [
	{ label: "Inicio", icon: HomeIcon },
	{
		label: "Articulos",
		icon: LocalMallIcon,
		subcategories: [{ label: "Insumos" }, { label: "Manufacturados" }],
	},
	{ label: "Categorias", icon: SellIcon },
	{ label: "Promociones", icon: PercentIcon },
	{ label: "Unidades de medida", icon: ScaleIcon },
];

const listItemsCajero: MenuItem[] = [
	{ label: "Inicio", icon: HomeIcon },
	{
		label: "Articulos",
		icon: LocalMallIcon,
		subcategories: [{ label: "Insumos" }, { label: "Manufacturados" }],
	},
	{ label: "Categorias", icon: SellIcon },
	{ label: "Promociones", icon: PercentIcon },
	{ label: "Pedidos", icon: ShoppingCartIcon },
];

const listItemsDelivery: MenuItem[] = [
	{ label: "Inicio", icon: HomeIcon },
	{ label: "Pedidos", icon: ShoppingCartIcon },
];
