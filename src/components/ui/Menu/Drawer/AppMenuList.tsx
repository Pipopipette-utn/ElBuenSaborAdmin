import { List, useMediaQuery } from "@mui/material";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { renderMenuItem } from "./MenuItemButton";
import { theme } from "../../../../styles/theme";
import { toKebabCase } from "../../../../utils/textTransform";
import { useAppSelector } from "../../../../redux/hooks";
import { MenuItem, getListItemsByRol } from "../../../../utils/listItems";

interface AppMenuListProps {
	open: boolean;
	setOpen: Function;
}

export const AppMenuList: FC<AppMenuListProps> = ({ open, setOpen }) => {
	const [openedListItems, setOpenedListItems] = useState<MenuItem[]>([]);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
	const user = useAppSelector((state) => state.auth.user);

	const listItems = user ? getListItemsByRol(user.rol!) : [];
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
