import * as Yup from "yup";
import { FC, useState } from "react";
import { IArticulo, IArticuloInsumo } from "../../../types/empresa";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
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
import ImageUpload from "./ImagenUpload";
import { findCategory } from "../../../utils/mapCategorias";
import { ImagenService } from "../../../services/ImagenService";

interface InsumoFormProps {
	initialArticuloInsumo: IArticuloInsumo;
	onClose: Function;
}

export const InsumoForm: FC<InsumoFormProps> = ({
	initialArticuloInsumo,
	onClose,
}) => {
	const dispatch = useAppDispatch();
	const categorias = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);
	const [activeStep, setActiveStep] = useState(0);
	const [articuloInsumo, setArticuloInsumo] = useState(initialArticuloInsumo);
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>(
		articuloInsumo.imagenes && articuloInsumo.imagenes.length > 0
			? articuloInsumo.imagenes.map((i) => i.url)
			: []
	);

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
		imagen: initialArticuloInsumo.imagenes ?? [],
	};

	const articuloInsumoSchema = Yup.object().shape({
		esParaElaborar: Yup.boolean(),
		precioCompra: Yup.number()
			.required("Este campo es requerido.")
			.min(0, "El precio no puede ser negativo."),
		stockActual: Yup.number()
			.required("Este campo es requerido.")
			.min(0, "El stock no puede ser negativo.")
			.test(
				"esMenorAStockMinimo",
				"El stock actual no puede ser menor que el stock mínimo.",
				function (value) {
					return value >= this.parent.stockMinimo;
				}
			)
			.test(
				"esMayorAStockMinimo",
				"El stock actual no puede ser mayor que el stock máximo.",
				function (value) {
					return value <= this.parent.stockMaximo;
				}
			),
		stockMaximo: Yup.number()
			.required("Este campo es requerido.")
			.min(0, "El stock no puede ser negativo.")
			.test(
				"esMenorAStockMinimo",
				"El stock máximo debe ser mayor que el stock mínimo.",
				function (value) {
					return value > this.parent.stockMinimo;
				}
			),
		stockMinimo: Yup.number()
			.required("Este campo es requerido.")
			.min(0, "El stock no puede ser negativo.")
			.test(
				"esMayorAStockMaximo",
				"El stock mínimo debe ser menor que el stock máximo.",
				function (value) {
					return value < this.parent.stockMaximo;
				}
			),
	});

	const handleSubmitArticulo = (articulo: IArticulo) => {
		const newArticuloInsumo = {
			...articuloInsumo,
			...articulo,
		};
		setArticuloInsumo(newArticuloInsumo);
		handleNext();
	};

	// Manejador de cambio de archivos seleccionados
	const handleFileChange = (
		submittedFiles: FileList | null,
		submittedPreviews: string[]
	) => {
		if (submittedFiles != null) {
			const newFiles = Array.from(submittedFiles);
			setFiles((prev) => [...prev, ...newFiles]);
		}
		setPreviews(submittedPreviews);
	};

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const articuloInsumoService = new ArticuloInsumoService(
				"/articulosInsumos"
			);
			const articuloImagenService = new ImagenService("/images/uploads");

			const categoria = findCategory(categorias, values.categoria);

			const newArticuloInsumo = {
				...articuloInsumo,
				stockActual: values.stockActual,
				stockMinimo: values.stockMinimo,
				stockMaximo: values.stockMaximo,
				precioCompra: values.precioCompra,
				precioVenta:
					values.precioVenta !== 0 ? parseFloat(values.precioVenta) : null,
				esParaElaborar: values.esParaElaborar,
				categoria: categoria,
				unidadMedida: articuloInsumo.unidadMedida,
			};
			let insumo;
			if (articuloInsumo.id) {
				insumo = await articuloInsumoService.update(
					articuloInsumo.id,
					newArticuloInsumo
				);
				dispatch(editArticuloInsumo(insumo));
			} else {
				insumo = await articuloInsumoService.create(newArticuloInsumo);
				dispatch(addArticuloInsumo(insumo));
			}

			if (files != null) {
				articuloImagenService.crearImagen(files, insumo!.id!);
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
			title: "Imagenes",
			fields: [],
		},
		{
			title: "Precio y stock",
			fields: [
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
				[
					{
						label: "Stock actual",
						name: "stockActual",
						type: "number",
						required: true,
					},
					{
						label: "Precio compra",
						name: "precioCompra",
						type: "number",
						icon: <AttachMoneyRoundedIcon />,
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

			{(() => {
				switch (activeStep) {
					case 0:
						return (
							<ArticuloForm
								articulo={articuloInsumo}
								submitButtonText={"Continuar"}
								handleSubmitForm={handleSubmitArticulo}
							/>
						);
					case 1:
						return (
							<ImageUpload
								imagenes={previews}
								onBack={handleBack}
								onNext={handleNext}
								onChangeImages={handleFileChange}
							/>
						);
					case 2:
						return (
							<GenericForm
								fields={steps[2].fields}
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
						);

					default:
						return null;
				}
			})()}
		</Stack>
	);
};
