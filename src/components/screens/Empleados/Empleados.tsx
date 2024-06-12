import {
	LinearProgress,
	Stack,
	Typography,
	TablePagination,
	CircularProgress,
} from "@mui/material";
import { GenericDoubleStack } from "../../ui/shared/GenericDoubleStack";
import ScaleIcon from "@mui/icons-material/Scale";
import { GenericHeaderStack } from "../../ui/shared/GenericTitleStack";
import { useAppSelector } from "../../../redux/hooks";
import { useState, useEffect } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import { useDispatch } from "react-redux";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
import { useAuth0 } from "@auth0/auth0-react";
import { EmpleadoAccordion } from "../../ui/accordion/EmpleadoAccordion";
import { EmpleadoService } from "../../../services/EmpleadoService";
import { setEmpleadosSucursal } from "../../../redux/slices/SelectedData";
import { theme } from "../../../styles/theme";
import { EmpleadoForm } from "../../ui/forms/EmpleadoForm";
import { emptyEmpleado } from "../../../types/emptyEntities";

const Empleados = () => {
	const empleadosService = new EmpleadoService("/empleados");
	const { getAccessTokenSilently } = useAuth0();
	const empleados = useAppSelector(
		(state) => state.selectedData.empleadosSucursal
	);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal) ?? [];
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleClick = () => handleOpenModal();

	const [totalRows, setTotalRows] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(6);
	const [loading, setLoading] = useState(false);

	const callApi = async () => {
		try {
			const token = await getAccessTokenSilently({
				authorizationParams: {
					audience: import.meta.env.VITE_AUTH0_AUDIENCE,
				},
			});
			console.log("token: " + token);
			return token;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	useEffect(() => {
		const findArticulos = async () => {
			try {
				const token = await callApi();
				if (sucursal !== null && !Array.isArray(sucursal) && token) {
					setLoading(true);
					const response = await empleadosService.getAllPagedBySucursal(
						sucursal!.id!,
						page,
						rowsPerPage
					);
					dispatch(setEmpleadosSucursal(response.data));
					setTotalRows(response.total);
					setLoading(false);
				}
			} catch (e) {
				dispatch(setEmpleadosSucursal(null));
			}
		};
		findArticulos();
	}, [sucursal, page, rowsPerPage]);

	const handlePageChange = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
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
						<ScaleIcon color="primary" sx={{ width: "40px", height: "40px" }} />
					}
					quantity={empleados?.length ?? 0}
					activeEntities={"Empleados"}
					buttonText={"Nuevo empleado"}
					onClick={handleClick}
				/>
				<>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography variant="h5">Todos los empleados</Typography>
					</Stack>
					{loading ? (
						<CircularProgress sx={{ mt: 6 }} />
					) : (
						<>
							<Stack direction="column" spacing={2} sx={{ p: "12px" }}>
								{empleados &&
									empleados !== "loading" &&
									empleados.map((empleado, index) => (
										<EmpleadoAccordion
											key={index}
											empleado={empleado}
											onShowSuccess={handleShowSuccess}
											onShowError={handleShowError}
										/>
									))}
							</Stack>
							{empleados === "loading" && (
								<LinearProgress sx={{ width: "100%" }} />
							)}
							{empleados === null && (
								<Typography>Ups! No hay empleados para mostrar.</Typography>
							)}
							<TablePagination
								sx={{ backgroundColor: theme.palette.bg.dark, width: "100%" }}
								rowsPerPageOptions={[10, 25, 100]}
								component="div"
								count={totalRows}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handlePageChange}
								onRowsPerPageChange={handleRowsPerPageChange}
							/>
						</>
					)}
				</>
			</GenericDoubleStack>
			<GenericModal
				title={"Crear empleado"}
				icon={<ScaleIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<EmpleadoForm
					initialEmpleado={emptyEmpleado}
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
export default Empleados;
