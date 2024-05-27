import { CircularProgress, Stack, Typography } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import { emptyPromocion } from "../../../types/emptyEntities";
import { IPromocion } from "../../../types/empresa";
import { PromocionForm } from "../../ui/forms/PromocionForm";
import { PromocionAccordion } from "../../ui/accordion/PromocionAccordion";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { PromocionService } from "../../../services/PromocionService";
import { setPromocionesSucursal } from "../../../redux/slices/SelectedData";

export const Promociones = () => {
	const dispatch = useAppDispatch();
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);
	const promocionService = new PromocionService("/promociones");

	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const promos = useAppSelector(
		(state) => state.selectedData.promocionesSucursal
	);
	const [promociones, setPromociones] = useState<IPromocion[]>(promos ?? []);

	useEffect(() => {
		const findPromociones = async () => {
			if (sucursal) {
				setLoading(true);
				const promociones = await promocionService.getAll();
				const promocionesSucursal = promociones.filter(
					(promocion) =>
						promocion.sucursales.find((p) => p.id === sucursal.id) != undefined
				);
				dispatch(setPromocionesSucursal(promocionesSucursal));
				setLoading(false);
			}
		};
		findPromociones();
		setPromociones(promos ?? []);
	}, [sucursal]);

	return (
		<>
			<GenericDoubleStack>
				<GenericHeaderStack
					icon={
						<LoyaltyIcon
							color="primary"
							sx={{ width: "40px", height: "40px" }}
						/>
					}
					quantity={promociones?.length ?? 0}
					activeEntities={"Promociones activas"}
					buttonText={"Nueva promoción"}
					onClick={handleOpenModal}
				/>
				<Stack sx={{ p: "12px" }}>
					<Typography variant="h5" sx={{ pb: "12px" }}>
						Todas las promociones
					</Typography>
					<Stack direction="column" width="100%" sx={{ p: "12px" }} spacing={2}>
						{loading ? (
							<CircularProgress sx={{ alignSelf: "center" }} />
						) : (
							promociones &&
							promociones.map((promocion, index) => (
								<PromocionAccordion key={index} promocion={promocion} />
							))
						)}
					</Stack>
				</Stack>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear promoción"}
				icon={<LoyaltyIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<PromocionForm
					initialPromocion={emptyPromocion}
					onClose={handleCloseModal}
				/>
			</GenericModal>
		</>
	);
};
