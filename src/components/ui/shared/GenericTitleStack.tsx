import { Button, Stack, Typography } from "@mui/material";
import { FC, ReactElement } from "react";
import { theme } from "../../../styles/theme";
import AddIcon from "@mui/icons-material/Add";

interface GenericHeaderStackProps {
	icon: ReactElement;
	quantity: number;
	activeEntities: string;
	buttonText: string;
}

export const GenericHeaderStack: FC<GenericHeaderStackProps> = ({
	icon,
	quantity,
	activeEntities,
	buttonText,
}) => {
	return (
		<Stack
			direction="row"
			height="100%"
			justifyContent="space-between"
			alignItems="center"
		>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Stack
					sx={{
						backgroundColor: theme.palette.primary.light,
						borderRadius: "50%",
						p: "6px",
					}}
				>
					{icon}
				</Stack>
				<Stack direction="column">
					<Typography
						sx={{ fontWeight: "bolder", fontSize: "36px", lineHeight: 1 }}
					>
						{quantity}
					</Typography>
					<Typography
						sx={{ fontWeight: "400", fontSize: "16px", lineHeight: 1 }}
					>
						{activeEntities}
					</Typography>
				</Stack>
			</Stack>
			<Button
				variant="contained"
				sx={{ borderRadius: "50px", p: "12px 20px" }}
				startIcon={<AddIcon />}
			>
				{buttonText}
			</Button>
		</Stack>
	);
};
