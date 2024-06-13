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
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";

const Promociones = () => {
	const dispatch = useAppDispatch();
	const promocionesRedux = useAppSelector(
		(state) => state.selectedData.promocionesSucursal
	);
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	useEffect(() => {
		if (promocionesRedux && promocionesRedux != "loading")
			setPromociones(promocionesRedux);
	}, [promocionesRedux]);

	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [promociones, setPromociones] = useState<IPromocion[]>([]);
	const [page, setPage] = useState(0);
	const [totalRows, setTotalRows] = useState(0);
	const itemsPerPage = 5;
	const promocionService = new PromocionService("/promociones");

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	useEffect(() => {
		let filtered = promociones;
		const findPromociones = async () => {
			if (sucursal !== null && !Array.isArray(sucursal)) {
				setLoading(true);
				const response = await promocionService.getAllPagedBySucursal(
					sucursal.id!,
					page,
					itemsPerPage
				);
				filtered = response.data;
				dispatch(setPromocionesSucursal(response.data));
				setTotalRows(response.total);
				setLoading(false);
			}
		};
		findPromociones();

		setPromociones(filtered);
	}, [sucursal, page]);

	const noOfPages = Math.ceil(totalRows / itemsPerPage);

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

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
					disabledButton={user!.rol! === "CAJERO" || user!.rol! === "COCINERO"}
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
								<PromocionAccordion
									key={index}
									promocion={promocion}
									onShowSuccess={handleShowSuccess}
									onShowError={handleShowError}
								/>
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
					onShowSuccess={handleShowSuccess}
					onShowError={handleShowError}
				/>
			</GenericModal>
			<SuccessMessage
				open={!!showSuccess}
				onClose={handleCloseSuccess}
				message={showSuccess}
			/>
			<ErrorMessage
				open={!!showError}
				onClose={handleCloseError}
				message={showError}
			/>
		</>
	);
};

export default Promociones;
