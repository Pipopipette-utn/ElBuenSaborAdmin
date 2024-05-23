import { FC, ReactElement } from "react";
import { Stack, Typography, styled } from "@mui/material";

interface DetailsGroupProps {
	labels: string[];
	content: string[];
	icons: ReactElement[];
}

export const DetailsGroup: FC<DetailsGroupProps> = ({
	labels,
	content,
	icons,
}) => {
	return (
		<Stack direction="row" width="100%">
			{labels.map((label, index) => (
				<Stack direction="row" key={index} sx={styles.border} spacing={1}>
					{icons[index]}
					<Stack spacing={1}>
						<Header>{label}</Header>
						<Content>{content[index]}</Content>
					</Stack>
				</Stack>
			))}
		</Stack>
	);
};

export const Header = styled(Typography)(({ theme }) => ({
	color: theme.palette.info.light,
	fontSize: "14px",
}));

export const Content = styled(Typography)(({ theme }) => ({
	color: theme.palette.info.main,
	fontWeight: "bold",
	fontSize: "15px",
}));

const styles = {
	border: {
		borderRadius: "20px",
		padding: "10px 24px",
		flex: 1,
	},
};
