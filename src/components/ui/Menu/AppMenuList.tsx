import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	SvgIcon,
} from "@mui/material";
import { FC, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SellIcon from "@mui/icons-material/Sell";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { theme } from "../../../styles/theme";

interface AppMenuListProps {
	open: boolean;
}

type MenuItem = {
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
			{ label: "Clientes" },
			{ label: "Empleados" },
			{ label: "Roles" },
		],
	},
];

export const AppMenuList: FC<AppMenuListProps> = ({ open }) => {
	const [openedListItems, setOpenedListItems] = useState<MenuItem[]>([]);

	const handleClick = (item: MenuItem) => {
		let updatedList;
		if (!item.subcategories || !open) {
			console.log("Seleccioné " + item);
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
				<ListItem key={index} disablePadding sx={{ display: "block" }}>
					<ListItemButton
						onClick={() => handleClick(item)}
						sx={{
							minHeight: 48,
							justifyContent: open ? "initial" : "center",
							px: 2.5,
							marginX: open ? "16px" : "0px",
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 0,
								mr: open ? 3 : "auto",
								justifyContent: "center",
							}}
						>
							<SvgIcon
								component={item.icon}
								sx={{ color: theme.palette.info.main }}
							/>
						</ListItemIcon>
						<ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
						{item.subcategories && open && (
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : "auto",
									justifyContent: "center",
								}}
							>
								{openedListItems.includes(item) ? (
									<KeyboardArrowUpIcon />
								) : (
									<KeyboardArrowDownIcon />
								)}
							</ListItemIcon>
						)}
					</ListItemButton>
					{item.subcategories && open && openedListItems.includes(item) && (
						<List>
							{item.subcategories.map((subcategory, subIndex) => (
								<ListItemButton
									key={subIndex}
									sx={{ pl: 4, marginX: "16px" }}
									onClick={() => handleClick(subcategory)}
								>
									{subcategory.icon && (
										<SvgIcon
											component={subcategory.icon}
											sx={{ color: theme.palette.info.main }}
										/>
									)}
									<ListItemText primary={subcategory.label} />
								</ListItemButton>
							))}
						</List>
					)}
				</ListItem>
			))}
		</List>
	);
};
