import {
	Avatar,
	Box,
	Button,
	Menu,
	MenuItem,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAppDispatch } from "../../../../redux/hooks";
import { theme } from "../../../../styles/theme";
import { setLogout } from "../../../../redux/slices/Auth";
export const UserButton = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const dispatch = useAppDispatch();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(setLogout());
	};

	return (
		<Box sx={{ position: "relative", display: "inline-block" }}>
			<Button
				id="demo-customized-button"
				aria-controls={open ? "demo-customized-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				variant="text"
				onClick={handleClick}
				endIcon={!isSmallScreen && <KeyboardArrowDownIcon />}
			>
				<Stack direction="row" spacing={2}>
					<Avatar
						sx={{ width: 40, height: 40, borderRadius: "10px" }}
						src="https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
					/>
					{!isSmallScreen && (
						<Stack sx={{ alignItems: "flex-start" }}>
							<Typography sx={{ color: theme.palette.bg.light }}>
								users.name
							</Typography>
							<Typography
								sx={{ fontWeight: "lighter", color: theme.palette.bg.light }}
							>
								user@email.com
							</Typography>
						</Stack>
					)}
				</Stack>
			</Button>
			<Menu
				id="demo-customized-menu"
				MenuListProps={{
					"aria-labelledby": "demo-customized-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem onClick={handleLogout} disableRipple>
					Cerrar sesión
				</MenuItem>
			</Menu>
		</Box>
	);
};
