import { Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../../styles/theme";
import {
	AddCard,
	AddCardActions,
	AddIconButton,
	CardHeader,
} from "../../ui/styled/StyledCard";
import { useAppSelector } from "../../../redux/hooks";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import EmpresaCard from "../../ui/cards/EmpresaCard";
import { useState } from "react";
import GenericModal from "../../ui/shared/GenericModal";
import { EmpresaForm } from "../../ui/forms/EmpresaForm";
import { emptyEmpresa } from "../../../types/emptyEntities";
import { Loader } from "../../ui/shared/Loader";
import { SuccessMessage } from "../../ui/shared/SuccessMessage";
import { ErrorMessage } from "../../ui/shared/ErrorMessage";
const ListaEmpresas = () => {
	const empresas = useAppSelector((state) => state.business.empresas);
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const [showSuccess, setShowSuccess] = useState("");
	const handleShowSuccess = (message: string) => setShowSuccess(message);
	const handleCloseSuccess = () => setShowSuccess("");

	const [showError, setShowError] = useState("");
	const handleShowError = (message: string) => setShowError(message);
	const handleCloseError = () => setShowError("");

	return (
		<Stack
			className="EmpresasContainer"
			mt="4%"
			justifyContent="center"
			sx={{ alignItems: "center" }}
		>
			<Typography variant="h1" textAlign="center">
				¿Qué empresa querés usar?
			</Typography>
			<Stack
				direction="row"
				sx={{
					justifyContent: "center",
					mt: "32px",
					flexWrap: "wrap",
				}}
			>
				{empresas !== null &&
					empresas !== "loading" &&
					empresas.map((empresa, index) => (
						<EmpresaCard
							key={index}
							empresa={empresa}
							onShowSuccess={handleShowSuccess}
							onShowError={handleShowError}
						/>
					))}
				<AddCard
					onClick={handleOpenModal}
					sx={{ border: `2px dashed ${theme.palette.info.light}` }}
				>
					<CardHeader title="Agregar" subheader="Nueva empresa" />
					<AddCardActions>
						<AddIconButton>
							<AddIcon fontSize="large" />
						</AddIconButton>
					</AddCardActions>
				</AddCard>
				{empresas === "loading" && <Loader />}
			</Stack>
			<GenericModal
				title={"Crear empresa"}
				icon={<AddBusinessIcon fontSize="large" />}
				open={showModal}
				handleClose={handleCloseModal}
			>
				<EmpresaForm
					initialEmpresa={emptyEmpresa}
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
		</Stack>
	);
};

export default ListaEmpresas;
