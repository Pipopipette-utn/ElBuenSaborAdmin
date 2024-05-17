import {
	Box,
	CSSObject,
	CssBaseline,
	IconButton,
	Theme,
	Toolbar,
	Typography,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DrawerHeader } from "./Header/DrawerHeader";
import { AppMenuList } from "./Drawer/AppMenuList";
import { background } from "../../../styles/palette";
import { SucursalSelect } from "./NavBar/SucursalSelect";
import { UserButton } from "./NavBar/UserButton";
import { fromKebabCase } from "../../../utils/textTransform";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	backgroundColor: background.main,
	overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	backgroundColor: background.main,
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
	zIndex: 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) =>
		prop !== "open" && prop !== "show" && prop !== "isSmall",
})<{ open: boolean; show: boolean; isSmall: boolean }>(
	({ theme, open, show, isSmall }) => ({
		display: show ? "block" : "none",
		position: isSmall && open && show ? "absolute" : "static",
		zIndex: isSmall && open && show ? 2 : 0,
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "",
		boxSizing: "border-box",
		...(open && {
			...openedMixin(theme),
			"& .MuiDrawer-paper": openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			"& .MuiDrawer-paper": closedMixin(theme),
		}),
	})
);

const Overlay = styled("div")<{ open: boolean }>(({ open }) => ({
	position: "fixed",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backgroundColor: "rgba(0, 0, 0, 0.6)",
	zIndex: 1,
	display: open ? "block" : "none",
}));

export const AppMenu = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [open, setOpen] = useState(isSmallScreen ? false : true);
	const path = useLocation().pathname;
	const isEmpresasPage =
		path === "/" || path === "/empresas" || path === "/empresas/sucursales";

	useEffect(() => {
		if (isSmallScreen) setOpen(false);
		else setOpen(true);
	}, [isSmallScreen]);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleOverlayClick = () => {
		setOpen(false);
	};

	return (
		<Box className="AppMenuContainer" sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open && !isEmpresasPage && !isSmallScreen}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					{!isEmpresasPage && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							sx={{
								marginRight: 5,
								...(open && { display: "none" }),
							}}
						>
							<MenuIcon />
						</IconButton>
					)}
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ color: theme.palette.bg.light }}
					>
						{path.replace(/\//g, " ").trim() === ""
							? "EMPRESAS"
							: fromKebabCase(path.toUpperCase().replace(/\//g, " "))}
					</Typography>
					{!isEmpresasPage && <SucursalSelect />}
					<UserButton />
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				open={open}
				show={!isEmpresasPage}
				isSmall={isSmallScreen}
			>
				<DrawerHeader setOpen={setOpen} />
				<AppMenuList open={open} setOpen={setOpen} />
			</Drawer>
			<Overlay open={open && isSmallScreen} onClick={handleOverlayClick} />
		</Box>
	);
};
