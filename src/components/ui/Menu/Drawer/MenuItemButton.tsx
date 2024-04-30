import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	SvgIcon,
	Typography,
} from "@mui/material";
import { FC } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLocation } from "react-router-dom";
import { MenuItem } from "./AppMenuList";
import { theme } from "../../../../styles/theme";

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
				{open && (
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
				)}
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
	index: number,
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
