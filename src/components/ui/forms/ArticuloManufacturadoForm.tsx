import * as Yup from "yup";
import { FC, useState } from "react";
import {
	IArticulo,
	IArticuloManufacturado,
	IArticuloManufacturadoDetalle,
} from "../../../types/empresa";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NotesIcon from "@mui/icons-material/Notes";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useAppDispatch } from "../../../redux/hooks";
import { IStep } from "../../../types/business";
import { Stack } from "@mui/material";
import FormStepper from "../shared/FormStepper";
import { ArticuloForm } from "./ArticuloForm";
import { GenericForm } from "../shared/GenericForm";
import { ArticuloManufacturadoService } from "../../../services/ArticuloManufacturadoService";
import {
	addArticuloManufacturado,
	editArticuloManufacturado,
} from "../../../redux/slices/Business";
import dayjs from "dayjs";
import { DetalleFormCardList } from "../cards/DetalleFormCardList";

interface InsumoFormProps {
	initialArticuloManufacturado: IArticuloManufacturado;
	onClose: Function;
}

export const ArticuloManufacturadoForm: FC<InsumoFormProps> = ({
	initialArticuloManufacturado,
	onClose,
}) => {
	const dispatch = useAppDispatch();

	const [activeStep, setActiveStep] = useState(0);
	const [articuloManufacturado, setarticuloManufacturado] = useState(
		initialArticuloManufacturado
	);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const initialValues = {
		...articuloManufacturado,
		precioVenta:
			articuloManufacturado.precioVenta === 0
				? ""
				: articuloManufacturado.precioVenta,
		tiempoEstimadoMinutos: articuloManufacturado.tiempoEstimadoMinutos
			? dayjs(`2024-05-13T00:${articuloManufacturado.tiempoEstimadoMinutos}:00`)
			: dayjs(`2024-05-13T00:00:00`),
		unidadMedida: articuloManufacturado.unidadMedida
			? articuloManufacturado.unidadMedida.denominacion
			: "",
		categoria: articuloManufacturado.categoria
			? articuloManufacturado.categoria.denominacion
			: "",
		imagen:
			articuloManufacturado.imagenes &&
			articuloManufacturado.imagenes.length > 0
				? articuloManufacturado.imagenes![0].url
				: "",
	};

	let articuloManufacturadoSchema = Yup.object().shape({
		precioVenta: Yup.number().required("Este campo es requerido."),
		tiempoEstimadoMinutos: Yup.string().required("Este campo es requerido."),
		descripcion: Yup.string().trim().required("Este campo es requerido."),
		preparacion: Yup.string().trim().required("Este campo es requerido."),
	});

	const handleSubmitArticulo = (articulo: IArticulo) => {
		const newarticuloManufacturado = {
			...articuloManufacturado,
			...articulo,
		};
		setarticuloManufacturado(newarticuloManufacturado);
		handleNext();
	};

	const handleSubmitDescripcion = (values: { [key: string]: any }) => {
		const newarticuloManufacturado = {
			...articuloManufacturado,
			...values,
			tiempoEstimadoMinutos: values.tiempoEstimadoMinutos.format("mm"),
		};
		console.log(values);
		setarticuloManufacturado(newarticuloManufacturado);
		handleNext();
	};

	const handleSubmitDetalles = (detalles: IArticuloManufacturadoDetalle[]) => {
		const newarticuloManufacturado = {
			...articuloManufacturado,
			articuloManufacturadoDetalles: detalles,
		};
		setarticuloManufacturado(newarticuloManufacturado);
		handleNext();
		handleSubmitForm();
	};

	const handleSubmitForm = async () => {
		try {
			const articuloManufacturadoService = new ArticuloManufacturadoService(
				"/articulosInsumos"
			);

			if (articuloManufacturado.id) {
				const updatedInsumo = await articuloManufacturadoService.update(
					articuloManufacturado.id,
					articuloManufacturado
				);
				dispatch(editArticuloManufacturado(updatedInsumo));
			} else {
				const artManufacturado = await articuloManufacturadoService.create(
					articuloManufacturado
				);
				dispatch(addArticuloManufacturado(artManufacturado));
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
			title: "Precio y descripción",
			fields: [
				[
					{
						label: "Precio de venta",
						name: "precioVenta",
						type: "number",
						icon: <MonetizationOnIcon />,
						required: true,
					},
					{
						label: "Tiempo estimado (mins)",
						name: "tiempoEstimadoMinutos",
						type: "time",
						timeView: ["minutes"],
						icon: <AttachMoneyRoundedIcon />,
						required: true,
					},
				],
				[
					{
						label: "Descripción",
						name: "descripcion",
						type: "text",
						icon: <NotesIcon />,
						required: true,
					},
				],
				[
					{
						label: "Preparacion",
						name: "preparacion",
						type: "text",
						multiline: true,
						icon: <ReceiptLongIcon />,
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
			title: "Sucursal y categoría",
			fields: [],
		},
	];
	return (
		<Stack alignItems="center" spacing={3}>
			<Stack width={"80%"} marginBottom={2}>
				<FormStepper steps={steps} activeStep={activeStep} />
			</Stack>

			{(() => {
				switch (activeStep) {
					case 0:
						return (
							<ArticuloForm
								articulo={articuloManufacturado}
								submitButtonText={"Continuar"}
								handleSubmitForm={handleSubmitArticulo}
							/>
						);
					case 1:
						return (
							<GenericForm
								fields={steps[activeStep].fields}
								initialValues={initialValues}
								validationSchema={articuloManufacturadoSchema}
								onBack={handleBack}
								onSubmit={handleSubmitDescripcion}
								submitButtonText={"Continuar"}
							/>
						);
					case 2:
						return (
							<DetalleFormCardList
								detallesArticulo={
									articuloManufacturado.articuloManufacturadoDetalles!
								}
								onBack={handleBack}
								onSubmit={handleSubmitDetalles}
								submitButtonText={"Continuar"}
							/>
						);
					default:
						return null;
				}
			})()}
		</Stack>
	);
};