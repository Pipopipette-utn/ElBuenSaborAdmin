import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	SvgIcon,
	Typography,
} from "@mui/material";
import { FC } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { theme } from "../../../styles/theme";
import { useLocation } from "react-router-dom";
import { MenuItem } from "./AppMenuList";
import React from "react";

interface MenuItemButtonProps {
	open: boolean;
	item: MenuItem;
	index: string;
	onClick: Function;
	openedListItems: MenuItem[];
}

const MenuItemButton: FC<MenuItemButtonProps> = ({
	open,
	item,
	index,
	onClick,
	openedListItems,
}) => {
	const path = useLocation().pathname.slice(1);
	console.log(path);

	return (
		<ListItem key={index} disablePadding sx={{ display: "block" }}>
			<ListItemButton
				onClick={() => onClick(item)}
				sx={{
					minHeight: 48,
					justifyContent: open ? "initial" : "center",
					px: 2.5,
					marginX: open ? "16px" : "0px",
					backgroundColor:
						path === item.label.toLowerCase()
							? theme.palette.primary.main
							: theme.palette.bg.main,
				}}
			>
				{item.icon && (
					<ListItemIcon
						sx={{
							minWidth: 0,
							mr: open ? 3 : "auto",
							justifyContent: "center",
						}}
					>
						<SvgIcon
							component={item.icon}
							sx={{
								color:
									path === item.label.toLowerCase()
										? theme.palette.bg.light
										: theme.palette.info.main,
							}}
						/>
					</ListItemIcon>
				)}
				<Typography
					sx={{
						width: "100%",
						color:
							path === item.label.toLowerCase()
								? theme.palette.bg.light
								: theme.palette.info.main,
					}}
				>
					{item.label}
				</Typography>
				{item.subcategories && open && (
					<ListItemIcon
						sx={{
							minWidth: 0,
							mr: open ? 3 : "auto",
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
		</ListItem>
	);
};

export const renderMenuItem = (
	item: MenuItem,
	index: string,
	open: boolean,
	openedListItems: MenuItem[],
	onClick: Function
) => {
	const key = item.label.concat(index.toString());

	return (
		<MenuItemButton
			open={open}
			item={item}
			index={key}
			openedListItems={openedListItems}
			onClick={onClick}
		/>
	);
};
