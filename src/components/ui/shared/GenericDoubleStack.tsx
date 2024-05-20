import { ReactNode } from "react";
import { ContainerStack, StyledStack } from "../../ui/styled/StyledStack";
import "../../../styles/scrollbar.css";
import { Stack } from "@mui/material";

export const GenericDoubleStack = ({ children }: { children: ReactNode[] }) => {
	return (
		<ContainerStack spacing={2}>
			<StyledStack height="12vh">{children[0]}</StyledStack>
			<StyledStack height="70vh">
				<Stack sx={{ overflowY: "auto", height: "100%", p: "12px" }}>
					{children[1]}
				</Stack>
			</StyledStack>
		</ContainerStack>
	);
};
