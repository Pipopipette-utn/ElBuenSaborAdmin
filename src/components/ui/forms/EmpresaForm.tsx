import * as Yup from "yup";
import { FC, useState } from "react";
import { IEmpresa } from "../../../types/empresa";

import BadgeIcon from "@mui/icons-material/Badge";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { GenericForm } from "../shared/GenericForm";
import { EmpresaService } from "../../../services/EmpresaService";
import { useAppDispatch } from "../../../redux/hooks";
import { setEmpresas } from "../../../redux/slices/Business";
import { IStep } from "../../../types/business";
import { Stack } from "@mui/material";
import FormStepper from "../shared/FormStepper";
import ImageUpload from "./ImagenUpload";
import { ImagenService } from "../../../services/ImagenService";

interface EmpresaFormProps {
	initialEmpresa: IEmpresa;
	onClose: Function;
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

export const EmpresaForm: FC<EmpresaFormProps> = ({
	initialEmpresa,
	onClose,
	onShowSuccess,
	onShowError,
}) => {
	console.log(initialEmpresa);
	const dispatch = useAppDispatch();
	const [empresa, setEmpresa] = useState(initialEmpresa);
	empresa;
	const [activeStep, setActiveStep] = useState(0);
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>(
		initialEmpresa.imagenEmpresa ? [initialEmpresa.imagenEmpresa?.url] : []
	);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const initialValues = {
		...empresa,
		cuil: empresa.cuil == 0 ? "" : empresa.cuil,
	};

	let empresaSchema = Yup.object().shape({
		nombre: Yup.string().trim().required("Este campo es requerido."),
		razonSocial: Yup.string().required("Este campo es requerido."),
		cuil: Yup.string()
			.matches(/^[0-9]+$/, "El campo sólo puede tener números")
			.min(10, "El CUIL debe tener al menos 10 caracteres.")
			.required("Este campo es requerido."),
	});

	const handleSubmitEmpresa = async (values: { [key: string]: any }) => {
		const newEmpresa: IEmpresa = {
			...empresa,
			baja: false,
			nombre: values.nombre,
			razonSocial: values.razonSocial,
			cuil: values.cuil,
		};
		setEmpresa(newEmpresa);
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

	const handleSubmitForm = async () => {
		try {
			const empresaService = new EmpresaService("/empresas");
			const imagenService = new ImagenService("/imagenesEmpresa/uploads");

			let createdEmpresa;
			if (initialEmpresa.id) {
				createdEmpresa = await empresaService.update(
					initialEmpresa.id,
					empresa
				);
				onShowSuccess("Empresa editada con éxito!");
			} else {
				createdEmpresa = await empresaService.create(empresa);
				onShowSuccess("Empresa creada con éxito!");
			}

			if (files != null) {
				await imagenService.crearImagen(files, createdEmpresa.id!);
			}

			const empresas = await empresaService.getAll();
			dispatch(setEmpresas(empresas));
			onClose();
		} catch (error: any) {
			onShowError("Error en el alta de empresa: " + error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Datos de la empresa",
			fields: [
				[
					{
						label: "Nombre",
						name: "nombre",
						type: "text",
						icon: <AssignmentIndIcon />,
						required: true,
					},
					{
						label: "Razón social",
						name: "razonSocial",
						type: "text",
						icon: <FingerprintIcon />,
						required: true,
					},
				],
				[
					{
						label: "CUIL",
						name: "cuil",
						type: "text",
						icon: <BadgeIcon />,
						required: true,
					},
				],
			],
		},
		{
			title: "Imagen de la empresa",
			fields: [],
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
							<GenericForm
								fields={steps[0].fields}
								initialValues={initialValues}
								validationSchema={empresaSchema}
								onSubmit={handleSubmitEmpresa}
								submitButtonText="Siguiente"
							/>
						);
					case 1:
						return (
							<ImageUpload
								imagenes={previews}
								onBack={handleBack}
								onNext={handleSubmitForm}
								onChangeImages={handleFileChange}
								multiple={false}
							/>
						);

					default:
						return null;
				}
			})()}
		</Stack>
	);
};
