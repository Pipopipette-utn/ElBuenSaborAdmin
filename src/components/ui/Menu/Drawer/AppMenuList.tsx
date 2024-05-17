import { List, useMediaQuery } from "@mui/material";
import { FC, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SellIcon from "@mui/icons-material/Sell";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";
import ScaleIcon from "@mui/icons-material/Scale";
import { Link } from "react-router-dom";
import { renderMenuItem } from "./MenuItemButton";
import { theme } from "../../../../styles/theme";
import { toKebabCase } from "../../../../utils/textTransform";

interface AppMenuListProps {
	open: boolean;
	setOpen: Function;
}

export type MenuItem = {
	label: string;
	icon?: React.ElementType<any>;
	subcategories?: MenuItem[];
};

const listItems: MenuItem[] = [
	{ label: "Inicio", icon: HomeIcon },
	{ label: "Sucursales", icon: StoreIcon },
	{
		label: "Articulos",
		icon: LocalMallIcon,
		subcategories: [{ label: "Insumos" }, { label: "Manufacturados" }],
	},
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
	{ label: "Unidades de medida", icon: ScaleIcon },
];

export const AppMenuList: FC<AppMenuListProps> = ({ open, setOpen }) => {
	const [openedListItems, setOpenedListItems] = useState<MenuItem[]>([]);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

	const handleClick = (item: MenuItem) => {
		let updatedList;
		if (!item.subcategories || !open) {
			if (isSmallScreen) setOpen(false);
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
				<div key={index}>
					{!item.subcategories || !open ? (
						<Link
							to={`/${toKebabCase(item.label)}`}
							style={{ textDecoration: "none" }}
						>
							{renderMenuItem(item, index, open, openedListItems, handleClick)}
						</Link>
					) : (
						renderMenuItem(item, index, open, openedListItems, handleClick)
					)}
					{item.subcategories && open && openedListItems.includes(item) && (
						<List>
							{item.subcategories.map((subcategory, subIndex) => (
								<div key={subIndex}>
									{!subcategory.subcategories || !open ? (
										<Link
											to={`${toKebabCase(
												item.label.toLowerCase()
											)}/${toKebabCase(subcategory.label.toLowerCase())}`}
											style={{ textDecoration: "none" }}
										>
											{renderMenuItem(
												subcategory,
												subIndex,
												open,
												openedListItems,
												handleClick
											)}
										</Link>
									) : (
										renderMenuItem(
											subcategory,
											subIndex,
											open,
											openedListItems,
											handleClick
										)
									)}
								</div>
							))}
						</List>
					)}
				</div>
			))}
		</List>
	);
};
