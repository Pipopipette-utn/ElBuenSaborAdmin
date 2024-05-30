import { CircularProgress, Stack, Typography, Pagination } from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useEffect, useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import { emptyPromocion } from "../../../types/emptyEntities";
import { IPromocion } from "../../../types/empresa";
import { PromocionForm } from "../../ui/forms/PromocionForm";
import { PromocionAccordion } from "../../ui/accordion/PromocionAccordion";
import { PromocionService } from "../../../services/PromocionService";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setPromocionesSucursal } from "../../../redux/slices/SelectedData";

export const Promociones = () => {
	const dispatch = useAppDispatch();
	const promocionesRedux = useAppSelector(
		(state) => state.selectedData.promocionesSucursal
	);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	useEffect(() => {
		if (promocionesRedux) setPromociones(promocionesRedux);
	}, [promocionesRedux]);

	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [promociones, setPromociones] = useState<IPromocion[]>([]);
	const [page, setPage] = useState(1);
	const [totalRows, setTotalRows] = useState(0);
	const itemsPerPage = 5;
	const promocionService = new PromocionService("/promociones");

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const fetchPromociones = async () => {
		setLoading(true);
		const response = await promocionService.getAllPagedIncludeDeleted(
			page - 1,
			itemsPerPage
		);
		const promocionesSucursal = response.data.filter(
			(p) => p.sucursales && p.sucursales.some((s) => s.id === sucursal?.id)
		);

		setPromociones(promocionesSucursal);
		dispatch(setPromocionesSucursal(promocionesSucursal));
		setTotalRows(response.total);
		setLoading(false);
	};

	useEffect(() => {
		fetchPromociones();
	}, [page, sucursal]);

	const noOfPages = Math.ceil(totalRows / itemsPerPage);

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

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
					quantity={totalRows}
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
						) : promociones && promociones.length == 0 ? (
							<Typography>Ups! No hay ninguna promoción guardada.</Typography>
						) : (
							promociones &&
							promociones.map((promocion, index) => (
								<PromocionAccordion key={index} promocion={promocion} />
							))
						)}
					</Stack>
					{promociones && promociones.length > 0 && (
						<Pagination
							count={noOfPages}
							page={page}
							onChange={handlePageChange}
							sx={{ alignSelf: "center", mt: 2 }}
						/>
					)}
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
