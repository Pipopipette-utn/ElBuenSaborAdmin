import { Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import SucursalCardDetails from "../../ui/cards/SucursalCardDetails";

export const ArticulosManufacturados = () => {
	const sucursales = useAppSelector(
		(state) => state.business.sucursalesEmpresa
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
				activeEntities={"Productos activos"}
				buttonText={"Nuevo producto"}
			/>
			<>
				<Typography variant="h5" sx={{ p: "4px 0px 12px 24px" }}>
					Todos los productos manufacturados
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
