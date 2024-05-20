import * as Yup from "yup";
import { FC, useState } from "react";
import { IArticulo, IArticuloInsumo } from "../../../types/empresa";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import { useAppDispatch } from "../../../redux/hooks";
import { IStep } from "../../../types/business";
import { Stack } from "@mui/material";
import FormStepper from "../shared/FormStepper";
import { ArticuloForm } from "./ArticuloForm";
import { GenericForm } from "../shared/GenericForm";
import { ArticuloElaborarForm } from "./ArticuloElaborarForm";
import { ArticuloInsumoService } from "../../../services/ArticuloInsumoService";
import {
	addArticuloInsumo,
	editArticuloInsumo,
} from "../../../redux/slices/Business";

interface InsumoFormProps {
	initialArticuloInsumo: IArticuloInsumo;
	onClose: Function;
}

export const InsumoForm: FC<InsumoFormProps> = ({
	initialArticuloInsumo,
	onClose,
}) => {
	const dispatch = useAppDispatch();
	const [activeStep, setActiveStep] = useState(0);
	const [articuloInsumo, setArticuloInsumo] = useState(initialArticuloInsumo);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const initialValues = {
		...articuloInsumo,
		unidadMedida: initialArticuloInsumo.unidadMedida
			? initialArticuloInsumo.unidadMedida.denominacion
			: "",
		categoria: initialArticuloInsumo.categoria
			? initialArticuloInsumo.categoria.denominacion
			: "",
		imagen:
			initialArticuloInsumo.imagenes &&
			initialArticuloInsumo.imagenes.length > 0
				? initialArticuloInsumo.imagenes![0].url
				: "",
	};

	let articuloInsumoSchema = Yup.object().shape({
		esParaElaborar: Yup.boolean(),
		precioCompra: Yup.number().required("Este campo es requerido."),
		stockActual: Yup.number().required("Este campo es requerido."),
		stockMaximo: Yup.number().required("Este campo es requerido."),
		stockMinimo: Yup.number().required("Este campo es requerido."),
	});

	const handleSubmitArticulo = (articulo: IArticulo) => {
		const newArticuloInsumo = {
			...articuloInsumo,
			...articulo,
		};
		setArticuloInsumo(newArticuloInsumo);
		handleNext();
	};

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const articuloInsumoService = new ArticuloInsumoService(
				"/articulosInsumos"
			);
			const newArticuloInsumo: IArticuloInsumo = {
				...articuloInsumo,
				...values,
				precioVenta:
					values.precioVenta !== 0 ? parseFloat(values.precioVenta) : null,
				categoria:
					values.categoria !== ""
						? { id: values.categoria, baja: false, denominacion: "" }
						: undefined,
				unidadMedida: articuloInsumo.unidadMedida,
			};

			if (articuloInsumo.id) {
				const updatedInsumo = await articuloInsumoService.update(
					articuloInsumo.id,
					newArticuloInsumo
				);
				dispatch(editArticuloInsumo(updatedInsumo));
			} else {
				const artInsumo = await articuloInsumoService.create(newArticuloInsumo);
				dispatch(addArticuloInsumo(artInsumo));
			}
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Datos del artículo",
			fields: [],
		},
		{
			title: "Precio y stock",
			fields: [
				[
					{
						label: "Precio compra",
						name: "precioCompra",
						type: "number",
						icon: <AttachMoneyRoundedIcon />,
						required: true,
					},
					{
						label: "Stock actual",
						name: "stockActual",
						type: "number",
						required: true,
					},
				],
				[
					{
						label: "Stock minimo",
						name: "stockMinimo",
						type: "number",
						required: true,
					},
					{
						label: "Stock maximo",
						name: "stockMaximo",
						type: "number",
						required: true,
					},
				],
			],
		},
	];
	return (
		<Stack width="100%" alignItems="center" spacing={3}>
			<Stack width="80%" marginBottom={2}>
				<FormStepper steps={steps} activeStep={activeStep} />
			</Stack>

			{activeStep === 0 && (
				<ArticuloForm
					articulo={articuloInsumo}
					submitButtonText={"Continuar"}
					handleSubmitForm={handleSubmitArticulo}
				/>
			)}

			{activeStep === 1 && (
				<GenericForm
					fields={steps[activeStep].fields}
					initialValues={initialValues}
					validationSchema={articuloInsumoSchema}
					onBack={handleBack}
					onSubmit={handleSubmitForm}
					childrenPosition="top"
					submitButtonText={
						articuloInsumo.id ? "Editar insumo" : "Crear insumo"
					}
				>
					<ArticuloElaborarForm />
				</GenericForm>
			)}
		</Stack>
	);
};
