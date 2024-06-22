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
import ImageUpload from "./ImagenUpload";
import { ImagenesService } from "../../../services/ImagenesService";
import { editArticuloInsumoSucursal } from "../../../redux/slices/SelectedData";
import { SucursalesSelector } from "./SucursalesSelector";
import { ISucursalDTO } from "../../../types/dto";
import { addArticuloInsumo, editArticuloInsumo } from "../../../redux/slices/Business";

interface InsumoFormProps {
	initialArticuloInsumo: IArticuloInsumo;
	onClose: Function;
	onShowSuccess: (m: string) => void;
	onShowError: (m: string) => void;
	onReload: () => void;
}

export const InsumoForm: FC<InsumoFormProps> = ({
	initialArticuloInsumo,
	onClose,
	onShowSuccess,
	onShowError,
	onReload,
}) => {
	const user = useAppSelector((state) => state.auth.user);
	const dispatch = useAppDispatch();
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
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
			? initialArticuloInsumo.categoria
			: null,
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
		if (articuloInsumo.imagenes) {
			const newImagenes = articuloInsumo.imagenes.filter((imagen) =>
				submittedPreviews.includes(imagen.url)
			);
			const newArticulo = {
				...articuloInsumo,
				imagenes: newImagenes,
			};
			setArticuloInsumo(newArticulo);
		}
	};

	const handleSubmitArticuloElaborar = (values: { [key: string]: any }) => {
		const newArticuloInsumo = {
			...articuloInsumo,
			stockActual: values.stockActual,
			stockMinimo: values.stockMinimo,
			stockMaximo: values.stockMaximo,
			precioCompra: values.precioCompra,
			precioVenta:
				values.precioVenta !== 0 ? parseFloat(values.precioVenta) : null,
			esParaElaborar: values.esParaElaborar,
			categoria: values.categoria,
			unidadMedida: articuloInsumo.unidadMedida,
		};

		setArticuloInsumo(newArticuloInsumo);

		if (
			initialArticuloInsumo.id ||
			(user!.rol! === "ADMIN" && user!.rol === "SUPERADMIN")
		)
			handleSubmitForm(undefined, newArticuloInsumo);
		else handleNext();
	};

	const handleSubmitForm = async (
		selectedSucursales?: ISucursalDTO[],
		articuloInsumoRecibido?: IArticuloInsumo
	) => {
		try {
			const articuloInsumoService = new ArticuloInsumoService(
				"/articulosInsumos"
			);
			const articuloImagenService = new ImagenesService("/images/uploads");

			let mappedSucursales = undefined;
			if (selectedSucursales) {
				mappedSucursales = selectedSucursales.map((s) => {
					return { id: s.id, baja: s.baja, nombre: s.nombre };
				});
			} else {
				mappedSucursales = [
					{ id: sucursal!.id, baja: false, nombre: sucursal!.nombre },
				];
			}

			let newArticuloInsumo;
			if (articuloInsumoRecibido) {
				newArticuloInsumo = {
					...articuloInsumoRecibido,
					sucursales: mappedSucursales,
				};
			} else {
				newArticuloInsumo = {
					...articuloInsumo,
					sucursales: mappedSucursales,
				};
			}

			let insumo;
			let insumos;
			if (articuloInsumo.id) {
				insumo = await articuloInsumoService.update(
					articuloInsumo.id,
					newArticuloInsumo
				);
				onReload();
				dispatch(editArticuloInsumo(insumo!));
				onShowSuccess("Artículo insumo modificado con éxito.");
			} else {
				insumos = await articuloInsumoService.createWithSucursal(
					newArticuloInsumo
				);
				insumo = insumos.find((i) => i.sucursal!.id === sucursal!.id);
				dispatch(addArticuloInsumo(insumo!));
				onReload();
				onShowSuccess("Artículo insumo creado con éxito.");
			}
			if (files != null) {
				await articuloImagenService.crearImagen(
					files,
					insumos ? insumos.map((i) => i.id!) : [insumo!.id!]
				);
				const newProducto = await articuloInsumoService.getById(insumo!.id!);
				if (newProducto != null) {
					dispatch(editArticuloInsumoSucursal(newProducto));
					dispatch(editArticuloInsumo(newProducto));
				}
			}
			onClose();
		} catch (error: any) {
			console.log(error);
			onShowError("Error en el alta de artículo insumo: " + error);
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

	if (
		!initialArticuloInsumo.id &&
		(user!.rol === "ADMIN" || user!.rol === "SUPERADMIN")
	) {
		steps.push({
			title: "Sucursales",
			fields: [],
		});
	}

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
								onSubmit={handleSubmitArticuloElaborar}
								childrenPosition="top"
								submitButtonText={
									!articuloInsumo.id ||
									user!.rol === "ADMIN" ||
									user!.rol === "SUPERADMIN"
										? "Siguiente"
										: "Editar insumo"
								}
							>
								<ArticuloElaborarForm />
							</GenericForm>
						);

					case 3:
						return (
							<SucursalesSelector
								selected={
									initialArticuloInsumo.sucursal
										? [initialArticuloInsumo.sucursal]
										: []
								}
								onBack={handleBack}
								handleSubmit={handleSubmitForm}
								buttonTitle={
									articuloInsumo.id ? "Editar insumo" : "Crear insumo"
								}
							/>
						);

					default:
						return null;
				}
			})()}
		</Stack>
	);
};
