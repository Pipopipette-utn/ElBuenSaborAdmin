import * as Yup from "yup";
import { FC, useState } from "react";
import {
	IArticulo,
	IArticuloManufacturado,
	IDetalle,
} from "../../../types/empresa";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NotesIcon from "@mui/icons-material/Notes";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { IStep } from "../../../types/business";
import { Stack } from "@mui/material";
import FormStepper from "../shared/FormStepper";
import { ArticuloForm } from "./ArticuloForm";
import { GenericForm } from "../shared/GenericForm";
import { ArticuloManufacturadoService } from "../../../services/ArticuloManufacturadoService";
import dayjs from "dayjs";
import { DetalleFormCardList } from "../cards/DetalleFormCardList";
import ImagenUpload from "./ImagenUpload";
import { ImagenService } from "../../../services/ImagenService";
import {
	addArticuloManufacturadoSucursal,
	editArticuloManufacturadoSucursal,
} from "../../../redux/slices/SelectedData";
import { SucursalesSelector } from "./SucursalesSelector";
import { ISucursalDTO } from "../../../types/dto";

interface InsumoFormProps {
	initialArticuloManufacturado: IArticuloManufacturado;
	onClose: Function;
	onShowSuccess: (m: string) => void;
	onShowError: (m: string) => void;
}

export const ArticuloManufacturadoForm: FC<InsumoFormProps> = ({
	initialArticuloManufacturado,
	onClose,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);
	const [articuloManufacturado, setArticuloManufacturado] = useState(
		initialArticuloManufacturado
	);
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>(
		articuloManufacturado.imagenes && articuloManufacturado.imagenes.length > 0
			? articuloManufacturado.imagenes.map((i) => i.url)
			: []
	);
	const [activeStep, setActiveStep] = useState(0);

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
		const newArticuloManufacturado = {
			...articuloManufacturado,
			...articulo,
		};
		setArticuloManufacturado(newArticuloManufacturado);
		handleNext();
	};

	const handleFileChange = (
		submittedFiles: FileList | null,
		submittedPreviews: string[]
	) => {
		if (submittedFiles != null) {
			const newFiles = Array.from(submittedFiles);
			setFiles((prev) => [...prev, ...newFiles]);
		}
		setPreviews(submittedPreviews);
		if (articuloManufacturado.imagenes) {
			const newImagenes = articuloManufacturado.imagenes.filter((imagen) =>
				submittedPreviews.includes(imagen.url)
			);
			const newArticulo = {
				...articuloManufacturado,
				imagenes: newImagenes,
			};
			setArticuloManufacturado(newArticulo);
		}
	};

	const handleSubmitDescripcion = (values: { [key: string]: any }) => {
		const newArticuloManufacturado = {
			...articuloManufacturado,
			...values,
			tiempoEstimadoMinutos: values.tiempoEstimadoMinutos.format("mm"),
		};
		setArticuloManufacturado(newArticuloManufacturado);
		handleNext();
	};

	const handleSubmitDetalles = (detalles: IDetalle[]) => {
		const newArticuloManufacturado = {
			...articuloManufacturado,
			articuloManufacturadoDetalles: detalles,
		};
		setArticuloManufacturado(newArticuloManufacturado);
		handleNext();
	};

	const handleSubmitForm = async (sucursales: ISucursalDTO[]) => {
		try {
			const articuloManufacturadoService = new ArticuloManufacturadoService(
				"/articulosManufacturados"
			);
			const articuloImagenService = new ImagenService("/images/uploads");

			const mappedSucursales = sucursales.map((s) => {
				return { id: s.id, baja: s.baja, nombre: s.nombre };
			});

			const newArticuloManufacturado = {
				...articuloManufacturado,
				sucursales: mappedSucursales,
			};

			console.log({ articuloManufacturado });

			let producto;
			if (articuloManufacturado.id) {
				producto = await articuloManufacturadoService.update(
					articuloManufacturado.id,
					newArticuloManufacturado
				);
				dispatch(editArticuloManufacturadoSucursal(producto));
				onShowSuccess("Artículo manufacturado modificado con éxito.");
			} else {
				const productos = await articuloManufacturadoService.createWithSucursal(
					newArticuloManufacturado
				);
				producto = productos.find((i) => i.sucursal!.id === sucursal!.id);
				dispatch(addArticuloManufacturadoSucursal(producto!));
				onShowSuccess("Artículo manufacturado creado con éxito.");
			}

			if (files != null && files.length > 0) {
				await articuloImagenService.crearImagen(files, producto!.id!);
				const newProducto = await articuloManufacturadoService.getById(
					producto!.id!
				);
				if (newProducto != null) {
					dispatch(editArticuloManufacturadoSucursal(newProducto));
				}
			}

			onClose();
		} catch (error: any) {
			onShowError("Error en el alta de artículo manufacturado: " + error);
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
			title: "Sucursales",
			fields: [],
		},
	];
	return (
		<Stack width={"100%"} alignItems="center" spacing={3}>
			<Stack width={"80%"} marginBottom={2}>
				<FormStepper steps={steps} activeStep={activeStep} />
			</Stack>

			{(() => {
				switch (activeStep) {
					case 0:
						return (
							<ArticuloForm
								articulo={articuloManufacturado}
								isManufacturado={true}
								submitButtonText={"Continuar"}
								handleSubmitForm={handleSubmitArticulo}
							/>
						);
					case 1:
						return (
							<ImagenUpload
								imagenes={previews}
								onBack={handleBack}
								onNext={handleNext}
								onChangeImages={handleFileChange}
							/>
						);
					case 2:
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
					case 3:
						return (
							<DetalleFormCardList
								detallesArticulo={
									articuloManufacturado.articuloManufacturadoDetalles!
								}
								onBack={handleBack}
								onSubmit={handleSubmitDetalles}
								submitButtonText={"Continuar"}
								esInsumo={true}
							/>
						);
					case 4:
						return (
							<SucursalesSelector
								selected={[]}
								onBack={handleBack}
								handleSubmit={handleSubmitForm}
								buttonTitle={
									articuloManufacturado.id
										? "Editar artículo manufacturado"
										: "Crear artículo manufacturado"
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
