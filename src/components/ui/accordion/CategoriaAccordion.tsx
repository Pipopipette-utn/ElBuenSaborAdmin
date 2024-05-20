import { AccordionSummary, Chip, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./AccordionStyles.css";
import tinycolor from "tinycolor2";

import { ICategoria } from "../../../types/empresa";
import { FC, MouseEvent, useState } from "react";
import { Accordion } from "../../ui/styled/StyledAccordion";
import { theme } from "../../../styles/theme";

import StyleIcon from "@mui/icons-material/Style";
import GenericModal from "../../ui/shared/GenericModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ActionButtons } from "./AccordionButtons";
import { CategoriaForm } from "../forms/CategoriaForm";

export const CategoriaAccordion: FC<{
	categoria: ICategoria;
	order: number;
}> = ({ categoria, order }) => {
	const [showModal, setShowModal] = useState<ICategoria | null>(null);

	const handleOpenModal = (categoria: ICategoria) => setShowModal(categoria);
	const handleCloseModal = () => setShowModal(null);

	const handleClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		categoria: ICategoria
	) => {
		event.stopPropagation(); // Detiene la propagación del evento
		handleOpenModal(categoria);
	};

	const getDarkerColor = (color: string, level: number) => {
		return tinycolor(color)
			.darken(level * 6)
			.toString();
	};
	const subcategoriaColor = getDarkerColor(theme.palette.bg.light, order);
	const buttonsColor = getDarkerColor(
		order === 0 ? theme.palette.primary.main : theme.palette.info.light,
		order
	);

	return (
		<>
			<Accordion sx={{ backgroundColor: subcategoriaColor }}>
				{categoria.subCategorias && categoria.subCategorias.length > 0 ? (
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Stack direction="row" spacing={2} alignItems="center">
							<Typography>{categoria.denominacion}</Typography>
							{categoria.esInsumo && (
								<Chip label="Es insumo" variant="outlined" color="primary" />
							)}
						</Stack>

						<ActionButtons
							categoria={categoria}
							onClick={(event: MouseEvent<HTMLButtonElement, MouseEvent>) =>
								handleClick(event, categoria)
							}
							color={buttonsColor}
						/>
					</AccordionSummary>
				) : (
					<AccordionSummary>
						<Stack direction="row" spacing={2} alignItems="center">
							<Typography>{categoria.denominacion}</Typography>
							{categoria.esInsumo && (
								<Chip label="Es insumo" variant="outlined" color="primary" />
							)}
						</Stack>
						<ActionButtons
							categoria={categoria}
							onClick={(
								event: MouseEvent<
									HTMLButtonElement,
									MouseEvent<Element, globalThis.MouseEvent>
								>
							) => handleClick(event, categoria)}
							color={buttonsColor}
						/>
					</AccordionSummary>
				)}
				{categoria.subCategorias && (
					<Stack
						direction="column"
						spacing={1}
						sx={{ p: "0px 12px 12px 12px" }}
					>
						{categoria.subCategorias.map((subcategoria, index) => (
							<CategoriaAccordion
								key={index}
								categoria={subcategoria}
								order={order + 1}
							/>
						))}
					</Stack>
				)}
			</Accordion>
			{showModal && (
				<GenericModal
					title={showModal.id ? "Editar categoría" : "Crear subcategoría"}
					icon={
						showModal.id ? (
							<LocalOfferIcon fontSize="large" />
						) : (
							<StyleIcon fontSize="large" />
						)
					}
					open={showModal !== null}
					handleClose={handleCloseModal}
				>
					<CategoriaForm
						buttonTitle="Editar categoria"
						initialCategoria={categoria}
						onClose={handleCloseModal}
					/>
				</GenericModal>
			)}
		</>
	);
};
