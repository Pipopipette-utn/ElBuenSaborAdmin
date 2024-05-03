import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import SucursalCardDetails from "../../ui/cards/SucursalCardDetails";

export const Sucursales = () => {
	const sucursales = useAppSelector(
		(state) => state.selectedData.sucursalesEmpresa
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
				quantity={sucursales?.length ?? 0}
				activeEntities={"Sucursales activas"}
				buttonText={"Nueva sucursal"}
			/>
			<>
				<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
					Todas las sucursales
				</Typography>
				<Stack direction="row" sx={{ flexWrap: "wrap", overflowY: "auto" }}>
					{sucursales &&
						sucursales.map((sucursal, index) => (
							<SucursalCardDetails sucursal={sucursal} key={index} />
						))}
				</Stack>
			</>
		</GenericDoubleStack>
	);
};
