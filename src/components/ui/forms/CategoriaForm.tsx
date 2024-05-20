import{ FC, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategoria } from "../../../types/empresa";
import { Stack } from "@mui/material";
import { IStep } from "../../../types/business";
import FormStepper from "../shared/FormStepper";
import { CategoriaFormAccordion } from "../accordion/CategoriaFormAccordion";
import { SucursalesSelector } from "./SucursalesSelector";
import { addCategoria, editCategoria } from "../../../redux/slices/Business";
import {
	editCategoriaSucursal,
	addCategoriaSucursal,
} from "../../../redux/slices/SelectedData";

interface CategoriaFormProps {
	initialCategoria: ICategoria;
	onClose: Function;
	buttonTitle: string;
}

export const CategoriaForm: FC<CategoriaFormProps> = ({
	initialCategoria,
	onClose,
	buttonTitle,
}) => {
	const dispatch = useAppDispatch();
	const [categoria, setCategoria] = useState(initialCategoria);

	const [activeStep, setActiveStep] = useState(0);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const handleChangeDenominaciones = (newCategoria: ICategoria) => {
		setCategoria(newCategoria);
		handleNext();
	};

	const handleSubmitForm = async (sucursalesIds: number[]) => {
		try {
			const categoriaService = new CategoriaService("/categorias");
			const newCategoria = {
				...categoria,
				sucursalesIds,
			};

			if (categoria.id) {
				const updatedCategoria = await categoriaService.update(
					categoria.id,
					newCategoria
				);
				dispatch(editCategoria(updatedCategoria));
				dispatch(editCategoriaSucursal(updatedCategoria));
			} else {
				const createdCategoria = await categoriaService.create(newCategoria);
				dispatch(addCategoria(createdCategoria));
				dispatch(addCategoriaSucursal(createdCategoria));
			}
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Categoría y subcategorías",
			fields: [],
		},
		{
			title: "Sucursales",
			fields: [],
		},
	];

	return (
		<Stack width={"100%"} alignItems="center" spacing={4}>
			<Stack width={"80%"} marginBottom={2}>
				<FormStepper steps={steps} activeStep={activeStep} />
			</Stack>
			{(() => {
				switch (activeStep) {
					case 0:
						return (
							<CategoriaFormAccordion
								initialCategoria={categoria}
								order={0}
								onChangeDenominaciones={handleChangeDenominaciones}
							/>
						);
					case 1:
						return (
							<SucursalesSelector
								buttonTitle={buttonTitle}
								onBack={handleBack}
								handleSubmit={handleSubmitForm}
							/>
						);
					default:
						return null;
				}
			})()}
		</Stack>
	);
};
