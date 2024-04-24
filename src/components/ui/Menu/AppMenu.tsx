import {
	Box,
	CSSObject,
	CssBaseline,
	IconButton,
	Stack,
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useEffect, useState } from "react";
import { background } from "../../../styles/palette";
import { AppMenuList } from "./AppMenuList";
import EmpresaIcon from "./EmpresaIcon";
import { UserButton } from "./UserButton";
import { SucursalSelect } from "./SucursalSelect";
import { useLocation } from "react-router-dom";

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

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
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
	shouldForwardProp: (prop) => prop !== "open" && prop !== "show",
})<{ open: boolean; show: boolean }>(({ theme, open, show }) => ({
	display: show ? "block" : "none",
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

export const AppMenu = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [open, setOpen] = useState(isSmallScreen ? false : true);
	const path = useLocation().pathname;
	const isEmpresasPage = path === "/";

	useEffect(() => {
		if (isSmallScreen) setOpen(false);
		else setOpen(true);
	}, [isSmallScreen]);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open && !isEmpresasPage}>
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
							: path.toUpperCase().replace(/\//g, " ")}
					</Typography>
					{!isEmpresasPage && <SucursalSelect />}
					<UserButton />
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open} show={!isEmpresasPage}>
				<DrawerHeader>
					<Stack
						direction="row"
						spacing={2}
						sx={{
							padding: "16px 24px",
							alignItems: "center",
							width: "100%",
						}}
					>
						<EmpresaIcon />
						<Typography variant="h5" noWrap component="div">
							Empresa
						</Typography>
					</Stack>
					{isSmallScreen && (
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === "rtl" ? (
								<ChevronRightIcon />
							) : (
								<ChevronLeftIcon />
							)}
						</IconButton>
					)}
				</DrawerHeader>
				<AppMenuList open={open} />
			</Drawer>
		</Box>
	);
};
