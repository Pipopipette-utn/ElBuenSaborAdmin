import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton, Stack, Typography, styled, useMediaQuery } from "@mui/material";
import EmpresaIcon from "./EmpresaIcon";
import { theme } from "../../../../styles/theme";
import { useAppSelector } from "../../../../redux/hooks";

const Header = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

export const DrawerHeader = ({setOpen}: {setOpen:Function}) => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const empresa = useAppSelector((state) => state.selectedData.empresa);

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Header>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					padding: "16px 24px 6px 24px",
					alignItems: "center",
					width: "100%",
				}}
			>
				<EmpresaIcon />
				<Typography variant="h5" noWrap component="div">
					{empresa?.nombre}
				</Typography>
			</Stack>
			{isSmallScreen && (
				<IconButton onClick={handleDrawerClose} sx={{mt: "4px"}}>
					{theme.direction === "rtl" ? (
						<ChevronRightIcon />
					) : (
						<ChevronLeftIcon />
					)}
				</IconButton>
			)}
		</Header>
	);
};
