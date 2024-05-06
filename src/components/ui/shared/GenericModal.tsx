import { Box, IconButton, Modal, Stack, Typography } from "@mui/material";
import { FC, ReactElement } from "react";
import { theme } from "../../../styles/theme";
import CloseIcon from "@mui/icons-material/Close";

interface GenericModalProps {
	title: string;
	icon: ReactElement;
	open: boolean;
	handleClose: any;
	children: ReactElement;
}

const style = {
	position: "absolute",
	borderRadius: "20px",
	top: "30%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	minWidth: 800,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: "2px",
};

const GenericModal: FC<GenericModalProps> = ({
	icon,
	title,
	open,
	handleClose,
	children,
}) => {
	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={style} flexDirection="row">
				<Stack
					sx={{
						border: `solid 2px ${theme.palette.bg.dark}`,
						p: 3,
						borderRadius: "20px",
					}}
				>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="center"
						alignItems="flex-end"
					>
						{icon}
						<Typography variant="h4" component="h2" textAlign="center">
							{title}
						</Typography>
						<IconButton
							sx={{ position: "absolute", right: 16, top: 16 }}
							onClick={handleClose}
						>
							<CloseIcon />
						</IconButton>
					</Stack>
					{children}
				</Stack>
			</Box>
		</Modal>
	);
};

export default GenericModal;