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
import { AlertDialog } from "../shared/AlertDialog";
import { CategoriaService } from "../../../services/CategoriaService";
import { useAppSelector } from "../../../redux/hooks";
import { useDispatch } from "react-redux";
import {
	editCategoriaSucursal,
	setCategoriasSucursal,
} from "../../../redux/slices/SelectedData";

export const CategoriaAccordion: FC<{
	categoria: ICategoria;
	order: number;
}> = ({ categoria, order }) => {
	const dispatch = useDispatch();
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const categoriasSucursal = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);

	const [showModal, setShowModal] = useState<ICategoria | null>(null);
	const [showAlert, setShowAlert] = useState(false);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);

	const handleOpenModal = (categoria: ICategoria) => setShowModal(categoria);
	const handleCloseModal = () => setShowModal(null);

	const handleOpenAlert = () => setShowAlert(true);
	const handleCloseAlert = () => setShowAlert(false);

	const handleOpenDeleteAlert = () => setShowDeleteAlert(true);
	const handleCloseDeleteAlert = () => setShowDeleteAlert(false);

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

	const handleBaja = async () => {
		const categoriaService = new CategoriaService("/categorias");
		await categoriaService.baja(categoria.id!, {
			id: sucursal!.id!,
			baja: sucursal!.baja,
			nombre: sucursal!.nombre,
		});
		//Si es una subcategoria, debo editar la categoria padre y borrarle la subcategoria borrada
		if (order > 0) {
			let categoriaPadre = categoriasSucursal?.find(
				(c) => c.id! === categoria.id
			)?.categoriaPadre;
			if (categoriaPadre) {
				categoriaPadre = categoriasSucursal!.find(
					(c) => c.id! === categoriaPadre!.id
				)!;
				const subCategorias = categoriaPadre.subCategorias!.filter(
					(s) => s.id != categoria.id!
				);
				categoriaPadre = { ...categoriaPadre, subCategorias };
				dispatch(editCategoriaSucursal(categoriaPadre));
			}
		}
		const newCategoriasSucursal = categoriasSucursal!.filter(
			(c) => c.id != categoria.id!
		);
		dispatch(setCategoriasSucursal(newCategoriasSucursal));
		handleCloseAlert();
	};

	const handleDelete = async () => {
		const categoriaService = new CategoriaService("/categorias");
		await categoriaService.delete(categoria.id!);
		const newCategoriasSucursal = categoriasSucursal!.filter(
			(c) => c.id != categoria.id!
		);
		dispatch(setCategoriasSucursal(newCategoriasSucursal));
		handleCloseDeleteAlert();
	};

	if (categoria && !categoria.baja)
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
								onEdit={(event: MouseEvent<HTMLButtonElement, MouseEvent>) =>
									handleClick(event, categoria)
								}
								color={buttonsColor}
								onBaja={handleOpenAlert}
								onDelete={handleOpenDeleteAlert}
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
								onEdit={(
									event: MouseEvent<
										HTMLButtonElement,
										MouseEvent<Element, globalThis.MouseEvent>
									>
								) => handleClick(event, categoria)}
								color={buttonsColor}
								onBaja={handleOpenAlert}
								onDelete={handleOpenDeleteAlert}
							/>
						</AccordionSummary>
					)}
					{categoria.subCategorias && (
						<Stack
							direction="column"
							spacing={1}
							sx={{ p: "0px 12px 12px 12px" }}
						>
							{categoria.subCategorias.map((subcategoria, index) => {
								if (!subcategoria.baja)
									return (
										<CategoriaAccordion
											key={index}
											categoria={subcategoria}
											order={order + 1}
										/>
									);
							})}
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
				<AlertDialog
					open={showAlert}
					title={"¿Estás seguro de que querés dar de baja la categoría?"}
					content={"La categoría y sus subcategorías se dará de baja sólo en la sucursal actual."}
					onAgreeClose={handleBaja}
					onDisagreeClose={handleCloseAlert}
				/>
				<AlertDialog
					open={showDeleteAlert}
					title={"¿Estás seguro de que querés eliminar la categoría?"}
					content={"La categoría se dará de baja en todas las sucursales."}
					onAgreeClose={handleDelete}
					onDisagreeClose={handleCloseDeleteAlert}
				/>
			</>
		);
};
