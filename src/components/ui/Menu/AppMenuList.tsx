import { List } from "@mui/material";
import { FC, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SellIcon from "@mui/icons-material/Sell";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { renderMenuItem } from "./MenuItemButton";

interface AppMenuListProps {
	open: boolean;
}

export type MenuItem = {
	label: string;
	icon?: React.ElementType<any>;
	subcategories?: MenuItem[];
};

const listItems: MenuItem[] = [
	{ label: "Inicio", icon: HomeIcon },
	{ label: "Sucursales", icon: StoreIcon },
	{ label: "Productos", icon: LocalMallIcon },
	{ label: "Categorias", icon: SellIcon },
	{ label: "Promociones", icon: PercentIcon },
	{
		label: "Usuarios",
		icon: PersonIcon,
		subcategories: [
			{ label: "Roles" },
			{ label: "Clientes" },
			{ label: "Empleados" },
		],
	},
];

export const AppMenuList: FC<AppMenuListProps> = ({ open }) => {
	const [openedListItems, setOpenedListItems] = useState<MenuItem[]>([]);

	const handleClick = (item: MenuItem) => {
		let updatedList;
		if (!item.subcategories || !open) {
			console.log("Seleccioné " + item.label);
		} else if (openedListItems.includes(item)) {
			updatedList = openedListItems.filter((menuItem) => menuItem !== item);
		} else {
			updatedList = [...openedListItems, item];
		}
		if (updatedList) setOpenedListItems(updatedList);
	};

	return (
		<List>
			{listItems.map((item, index) => (
				<>
					{!item.subcategories || !open ? (
						<Link to={`/${item.label.toLowerCase()}`}>
							{renderMenuItem(
								item,
								`${item.label}${index}`,
								open,
								openedListItems,
								handleClick
							)}
						</Link>
					) : (
						renderMenuItem(
							item,
							`${item.label}${index}`,
							open,
							openedListItems,
							handleClick
						)
					)}
					{item.subcategories && open && openedListItems.includes(item) && (
						<List>
							{item.subcategories.map((subcategory, subIndex) => (
								<>
									{!subcategory.subcategories || !open ? (
										<Link to={`/${subcategory.label.toLowerCase()}`}>
											{renderMenuItem(
												subcategory,
												`${subcategory.label}${subIndex}`,
												open,
												openedListItems,
												handleClick
											)}
										</Link>
									) : (
										renderMenuItem(
											subcategory,
											`${subcategory.label}${subIndex}`,
											open,
											openedListItems,
											handleClick
										)
									)}
								</>
							))}
						</List>
					)}
				</>
			))}
		</List>
	);
};
