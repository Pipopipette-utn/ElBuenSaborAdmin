import * as Yup from "yup";
import { FC, useState } from "react";
import { IPromocion, IDetalle, ISucursal } from "../../../types/empresa";
import { useAppDispatch } from "../../../redux/hooks";
import dayjs from "dayjs";
import { IStep } from "../../../types/business";

import RedeemIcon from "@mui/icons-material/Redeem";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import StyleIcon from "@mui/icons-material/Style";

import { Stack } from "@mui/material";
import FormStepper from "../shared/FormStepper";
import { GenericForm } from "../shared/GenericForm";
import ImageUpload from "./ImagenUpload";
import { DetalleFormCardList } from "../cards/DetalleFormCardList";
import { SucursalesSelector } from "./SucursalesSelector";
import { ISucursalDTO } from "../../../types/dto";
import { PromocionService } from "../../../services/PromocionService";
import {
	addPromocionesSucursal,
	editPromocionesSucursal,
} from "../../../redux/slices/SelectedData";
import { ImagenService } from "../../../services/ImagenService";

interface PromocionFormProps {
	initialPromocion: IPromocion;
	onClose: Function;
}

// En este componente uso un stepper ya que tiene 2 pasos el formulario: el de los datos de la promocion
// y el de la ubicacion.
export const PromocionForm: FC<PromocionFormProps> = ({
	initialPromocion,
	onClose,
}) => {
	const dispatch = useAppDispatch();
	const [promocion, setPromocion] = useState(initialPromocion);
	const [activeStep, setActiveStep] = useState(0);
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>(
		promocion.imagenes && promocion.imagenes.length > 0
			? promocion.imagenes.map((i) => i.url)
			: []
	);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const initialValues = {
		...promocion,
		denominacion: promocion.denominacion,
		descripcionDescuento: promocion.descripcionDescuento,
		fechaDesde: dayjs(promocion.fechaDesde),
		fechaHasta: dayjs(promocion.fechaHasta),
		horaDesde: dayjs(`2024-05-13T${promocion.horaDesde}`),
		horaHasta: dayjs(`2024-05-13T${promocion.horaHasta}`),
		precioPromocional:
			promocion.precioPromocional === 0 ? "" : promocion.precioPromocional,
		tipoPromocion:
			promocion.tipoPromocion == "HAPPY_HOUR"
				? "Happy Hour"
				: promocion.tipoPromocion == "PROMOCION"
				? "Promoción"
				: "",
		imagenes: promocion.imagenes,
		sucursales: promocion.sucursales,
		promocionDetalles: promocion.promocionDetalles,
	};
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let validationSchema: Yup.ObjectSchema<any, Yup.AnyObject, any, ""> =
		Yup.object().shape({
			denominacion: Yup.string().trim().required("Este campo es requerido."),
			descripcionDescuento: Yup.string().required("Este campo es requerido."),
			fechaDesde: Yup.date()
				.required("Este campo es requerido.")
				.min(today, "La fecha no puede ser anterior al día de hoy.")
				.max(
					Yup.ref("fechaHasta"),
					"La fecha desde debe ser anterior a la fecha hasta."
				),
			fechaHasta: Yup.date()
				.required("Este campo es requerido.")
				.min(
					Yup.ref("fechaDesde"),
					"La fecha hasta debe ser posterior a la fecha desde."
				),
			horaDesde: Yup.string().required("Este campo es requerido."),
			horaHasta: Yup.string().required("Este campo es requerido."),
			tipoPromocion: Yup.string().required("Este campo es requerido."),
		});

	const handleNextDatos = (values: { [key: string]: any }) => {
		let tipoPromocion: "HAPPY_HOUR" | "PROMOCION" | "";
		if (values.tipoPromocion === "Happy Hour") {
			tipoPromocion = "HAPPY_HOUR";
		} else if (values.tipoPromocion === "Promoción") {
			tipoPromocion = "PROMOCION";
		} else {
			tipoPromocion = "";
		}
		const newPromocion = {
			...promocion,
			...values,
			fechaDesde: values.fechaDesde.toISOString(),
			fechaHasta: values.fechaHasta.toISOString(),
			horaDesde: values.horaDesde.format("HH:mm:ss"),
			horaHasta: values.horaHasta.format("HH:mm:ss"),
			tipoPromocion: tipoPromocion,
		};
		setPromocion(newPromocion);
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
		if (promocion.imagenes) {
			const newImagenes = promocion.imagenes.filter((imagen) =>
				submittedPreviews.includes(imagen.url)
			);
			const newPromo = {
				...promocion,
				imagenes: newImagenes,
			};
			setPromocion(newPromo);
		}
	};

	const handleNextDetalles = async (detalles: IDetalle[], precio?: number) => {
		try {
			const newPromocion = {
				...promocion,
				promocionDetalles: detalles,
				precioPromocional: precio ?? 0,
			};
			setPromocion(newPromocion);
			handleNext();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const handleSubmitForm = async (sucursales: ISucursalDTO[] | ISucursal[]) => {
		try {
			const mappedSucursales = sucursales.map((s) => {
				return { id: s.id, baja: s.baja, nombre: s.nombre };
			});
			const promocionService = new PromocionService("/promociones");
			const imagenService = new ImagenService("/imagenesPromocion/uploads");

			const newPromocion = {
				...promocion,
				sucursales: mappedSucursales,
			};
			setPromocion(newPromocion);

			let promocionNueva;
			if (promocion.id) {
				promocionNueva = await promocionService.update(
					promocion.id,
					newPromocion
				);
				dispatch(editPromocionesSucursal(promocionNueva));
			} else {
				promocionNueva = await promocionService.create(newPromocion);
				dispatch(addPromocionesSucursal(promocionNueva));
			}

			if (files != null && files.length > 0) {
				imagenService.crearImagen(files, promocionNueva!.id!);
				const newPromo = await promocionService.getById(promocionNueva.id!);
				if (newPromo != null) {
					dispatch(editPromocionesSucursal(newPromo));
				}
			}
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Datos de la promoción",
			fields: [
				[
					{
						label: "Denominación",
						name: "denominacion",
						type: "text",
						icon: <RedeemIcon />,
						required: true,
					},
					{
						label: "Tipo de promoción",
						name: "tipoPromocion",
						type: "select",
						options: ["Happy Hour", "Promoción"],
						icon: <StyleIcon />,
						required: true,
					},
				],
				[
					{
						label: "Descripción",
						name: "descripcionDescuento",
						type: "text",
						icon: <DriveFileRenameOutlineIcon />,
						required: true,
					},
				],
				[
					{
						label: "Fecha de inicio",
						name: "fechaDesde",
						type: "date",
						required: true,
					},
					{
						label: "Fecha de fin",
						name: "fechaHasta",
						type: "date",
						required: true,
					},
				],
				[
					{
						label: "Hora desde",
						name: "horaDesde",
						type: "time",
						timeView: ["hours", "minutes"],
						required: true,
					},
					{
						label: "Hora hasta",
						name: "horaHasta",
						type: "time",
						timeView: ["hours", "minutes"],
						required: true,
					},
				],
			],
		},
		{
			title: "Imagenes",
			fields: [
				[
					{
						label: "Imagenes",
						name: "imagenes",
						type: "image",
						required: true,
					},
				],
			],
		},
		{
			title: "Detalles",
			fields: [],
		},
		{
			title: "Sucursales",
			fields: [],
		},
	];

	return (
		<>
			<Stack alignItems="center" spacing={3} width="100%">
				<Stack width={"80%"} marginBottom={2}>
					<FormStepper steps={steps} activeStep={activeStep} />
				</Stack>
				{(() => {
					switch (activeStep) {
						case 0:
							return (
								<GenericForm
									fields={steps[activeStep].fields}
									initialValues={initialValues}
									validationSchema={validationSchema}
									onSubmit={handleNextDatos}
									submitButtonText="Continuar"
								/>
							);
						case 1:
							return (
								<ImageUpload
									onChangeImages={handleFileChange}
									imagenes={previews}
									onBack={handleBack}
									onNext={handleNext}
								/>
							);
						case 2:
							return (
								<DetalleFormCardList
									detallesArticulo={promocion.promocionDetalles!}
									onBack={handleBack}
									onSubmit={handleNextDetalles}
									submitButtonText={"Continuar"}
									esInsumo={false}
									precioInicial={promocion.precioPromocional}
								/>
							);
						case 3:
							return (
								<SucursalesSelector
									selected={promocion.sucursales}
									onBack={handleBack}
									handleSubmit={handleSubmitForm}
									buttonTitle={
										promocion.id ? "Editar promoción" : "Crear promoción"
									}
								/>
							);

						default:
							return null;
					}
				})()}
			</Stack>
		</>
	);
};
