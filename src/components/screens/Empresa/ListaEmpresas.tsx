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

export const ListaEmpresas = () => {
	const empresas = useAppSelector((state) => state.business.empresas);
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	return (
		<Stack
			className="EmpresasContainer"
			height="100%"
			mt="4%"
			justifyContent="center"
			sx={{ overflowY: "scroll" }}
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
				{empresas &&
					empresas.map((empresa, index) => (
						<EmpresaCard key={index} empresa={empresa} />
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
				{!empresas && <Loader />}
				<GenericModal
					title={"Crear empresa"}
					icon={<AddBusinessIcon fontSize="large" />}
					open={showModal}
					handleClose={handleCloseModal}
				>
					<EmpresaForm empresa={emptyEmpresa} onClose={handleCloseModal} />
				</GenericModal>
			</Stack>
		</Stack>
	);
};
