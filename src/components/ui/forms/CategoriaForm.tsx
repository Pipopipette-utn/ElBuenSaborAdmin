import { FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategoria } from "../../../types/empresa";
import { Stack } from "@mui/material";
import { IStep } from "../../../types/business";
import FormStepper from "../shared/FormStepper";
import { CategoriaFormAccordion } from "../accordion/CategoriaFormAccordion";
import { SucursalesSelector } from "./SucursalesSelector";
import {
	editCategoriaSucursal,
	addCategoriaSucursal,
} from "../../../redux/slices/SelectedData";
import { ISucursalDTO } from "../../../types/dto";

interface CategoriaFormProps {
	initialCategoria: ICategoria;
	onClose: Function;
	buttonTitle: string;
	onShowSuccess: (m: string) => void;
	onShowError: (m: string) => void;
}

export const CategoriaForm: FC<CategoriaFormProps> = ({
	initialCategoria,
	onClose,
	buttonTitle,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const [categoria, setCategoria] = useState(initialCategoria);

	const [activeStep, setActiveStep] = useState(0);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const handleChangeDenominaciones = (newCategoria: ICategoria) => {
		setCategoria(newCategoria);
		if (user!.rol! === "ADMIN" && user!.rol === "SUPERADMIN") handleNext();
		else handleSubmitForm(undefined, newCategoria);
	};

	const setearSubcategorias = (categoria: ICategoria) => {
		console.log(categoria);
		if (categoria.subCategorias) {
			categoria.subCategorias = categoria.subCategorias.map((subcategoria) => {
				console.log(subcategoria);
				return {
					...subcategoria,
					esInsumo: categoria.esInsumo,
					esParaVender: categoria.esParaVender,
				};
			});
			categoria.subCategorias.forEach(setearSubcategorias);
		}
	};

	const handleSubmitForm = async (
		sucursales?: ISucursalDTO[],
		categoriaRecibida?: ICategoria
	) => {
		try {
			const categoriaService = new CategoriaService("/categorias");
			let mappedSucursales = undefined;
			if (sucursales) {
				mappedSucursales = sucursales.map((s) => {
					return { id: s.id, baja: s.baja, nombre: s.nombre };
				});
			}else{
				mappedSucursales = [{id: sucursal!.id, baja: false, nombre: sucursal!.nombre}];
			}
			
			let newCategoria;
			if (categoriaRecibida) {
				newCategoria = {
					...categoriaRecibida,
					sucursales: mappedSucursales,
				};
			} else {
				newCategoria = {
					...categoria,
					sucursales: mappedSucursales,
				};
			}
			setearSubcategorias(newCategoria);

			if (categoria.id) {
				const updatedCategoria = await categoriaService.update(
					categoria.id,
					newCategoria
				);
				dispatch(editCategoriaSucursal(updatedCategoria));
				onShowSuccess("Categoría editada con éxito");
			} else {
				const createdCategoria = await categoriaService.create(newCategoria);
				dispatch(addCategoriaSucursal(createdCategoria));
				onShowSuccess("Categoría creada con éxito");
			}
			onClose();
		} catch (error: any) {
			onShowError("Error en el alta de la categoría: " + error);
			throw new Error(error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Categoría y subcategorías",
			fields: [],
		},
	];

	if (user!.rol === "ADMIN" || user!.rol === "SUPERADMIN") {
		steps.push({
			title: "Sucursales",
			fields: [],
		});
	}

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
								selected={categoria.id ? categoria.sucursales! : []}
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
