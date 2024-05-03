import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { CategoriaAccordion } from "./CategoriaAccordion";

export const Categorias = () => {
	const categorias = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);

	return (
		<GenericDoubleStack>
			<GenericHeaderStack
				icon={
					<StoreMallDirectoryIcon
						color="primary"
						sx={{ width: "40px", height: "40px" }}
					/>
				}
				quantity={categorias?.length ?? 0}
				activeEntities={"Categorias activas"}
				buttonText={"Nueva categoria"}
			/>
			<Stack sx={{p: "12px"}}>
				<Typography variant="h5" sx={{pb: "12px"}}>
					Todas las categorias
				</Typography>
				<Stack direction="column" spacing={2} sx={{p: "12px"}}>
					{categorias &&
						categorias.map((categoria, index) => (
							<CategoriaAccordion key={index} categoria={categoria} order={0} />
						))}
				</Stack>
			</Stack>
		</GenericDoubleStack>
	);
};
