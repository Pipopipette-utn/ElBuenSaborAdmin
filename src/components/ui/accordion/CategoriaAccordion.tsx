import { AccordionSummary, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./AccordionStyles.css";
import tinycolor from "tinycolor2";

import { ICategoria } from "../../../types/empresa";
import { FC, useState } from "react";
import { Accordion } from "../../ui/styled/StyledAccordion";
import { theme } from "../../../styles/theme";

import StyleIcon from "@mui/icons-material/Style";
import GenericModal from "../../ui/shared/GenericModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ActionButtons } from "./AccordionButtons";

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
				{categoria.subcategorias && categoria.subcategorias.length > 0 ? (
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						{categoria.denominacion}
						<ActionButtons
							categoria={categoria}
							onClick={handleClick}
							color={buttonsColor}
						/>
					</AccordionSummary>
				) : (
					<AccordionSummary>
						{categoria.denominacion}
						<ActionButtons
							categoria={categoria}
							onClick={handleClick}
							color={buttonsColor}
						/>
					</AccordionSummary>
				)}
				{categoria.subcategorias && (
					<Stack
						direction="column"
						spacing={1}
						sx={{ p: "0px 12px 12px 12px" }}
					>
						{categoria.subcategorias.map((subcategoria, index) => (
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
					<>Formulario categoria</>
				</GenericModal>
			)}
		</>
	);
};


