import * as Yup from "yup";
import { FC, useState } from "react";

import BadgeIcon from "@mui/icons-material/Badge";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { GenericForm } from "../shared/GenericForm";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { IStep } from "../../../types/business";
import { IEmpleado } from "../../../types/usuarios";
import dayjs from "dayjs";
import { Stack } from "@mui/material";
import FormStepper from "../shared/FormStepper";
import ImageUpload from "./ImagenUpload";
import { EmpleadoService } from "../../../services/EmpleadoService";
import {
	addEmpleadoSucursal,
	editEmpleadoSucursal,
} from "../../../redux/slices/SelectedData";
import { Rol } from "../../../types/enums";
import { ImagenService } from "../../../services/ImagenService";

interface EmpleadoFormProps {
	initialEmpleado: IEmpleado;
	onClose: Function;
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

export const EmpleadoForm: FC<EmpleadoFormProps> = ({
	initialEmpleado,
	onClose,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();
	const sucursal = useAppSelector((state) => state.selectedData.sucursal);

	const [empleado, setEmpleado] = useState(initialEmpleado);
	const [activeStep, setActiveStep] = useState(0);
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>(
		initialEmpleado.imagenPersona ? [initialEmpleado.imagenPersona?.url] : []
	);

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const initialValues = {
		...initialEmpleado,
		fechaNacimiento: dayjs(empleado.fechaNacimiento),
		email: empleado.usuario.email,
		username: empleado.usuario.username,
		rol:
			empleado.usuario.rol === "ADMIN"
				? "Administrador"
				: empleado.usuario.rol === "COCINERO"
				? "Cocinero"
				: empleado.usuario.rol === "DELIVERY"
				? "Delivery"
				: "Cajero",
	};

	let empleadoSchema = Yup.object().shape({
		nombre: Yup.string().trim().required("Este campo es requerido."),
		apellido: Yup.string().trim().required("Este campo es requerido."),
		telefono: Yup.string().trim().required("Este campo es requerido."),
		fechaNacimiento: Yup.date().required("Este campo es requerido."),
	});

	let usuarioSchema = Yup.object().shape({
		email: Yup.string()
			.email("Este campo debe tener formato de email")
			.trim()
			.required("Este campo es requerido."),
		username: Yup.string().trim().required("Este campo es requerido."),
	});

	const handleSubmitEmpleado = (values: { [key: string]: any }) => {
		const newEmpleado = {
			...empleado,
			...values,
			fechaNacimiento: values.fechaNacimiento.toISOString(),
		};
		setEmpleado(newEmpleado);
		handleNext();
	};

	const handleSubmitUsuario = (values: { [key: string]: any }) => {
		const newEmpleado = {
			...empleado,
			usuario: {
				baja: false,
				email: values.email,
				username: values.username,
				rol: values.rol,
			},
		};
		setEmpleado(newEmpleado);
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
			const empleadoService = new EmpleadoService("/empleados");
			const empleadoImagenService = new ImagenService(
				"/imagenesPersona/uploads"
			);
			let rolName = empleado.usuario.rol;
			let rol = Rol[rolName as keyof typeof Rol];

			if (typeof rol !== "number") {
				throw new Error(`Invalid role name: ${rolName}`);
			}

			const newEmpleado = {
				...empleado,
				usuario: {
					...empleado.usuario,
					rol,
				},
				sucursal: {
					id: sucursal!.id!,
					baja: sucursal!.baja,
					nombre: sucursal!.nombre,
				},
			};

			let createdEmpleado;
			if (empleado.id) {
				createdEmpleado = await empleadoService.update(
					empleado.id,
					newEmpleado
				);
				dispatch(editEmpleadoSucursal(createdEmpleado));
				onShowSuccess("Empleado editado con éxito!");
			} else {
				createdEmpleado = await empleadoService.create(newEmpleado);
				dispatch(addEmpleadoSucursal(createdEmpleado!));
				onShowSuccess("Empleado creado con éxito!");
			}

			if (files != null) {
				await empleadoImagenService.crearImagen(files, createdEmpleado.id!);
				const empleadoImagen = await empleadoService.getById(
					createdEmpleado.id!
				);
				if (empleadoImagen != null) {
					dispatch(editEmpleadoSucursal(empleadoImagen));
				}
			}
			onClose();
		} catch (error: any) {
			console.log(error);
			onShowError("Error en el alta del empleado: " + error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Datos personales",
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
						label: "Apellido",
						name: "apellido",
						type: "text",
						icon: <BadgeIcon />,
						required: true,
					},
				],
				[
					{
						label: "Teléfono",
						name: "telefono",
						type: "text",
						icon: <LocalPhoneIcon />,
						required: true,
					},
					{
						label: "Fecha de nacimiento",
						name: "fechaNacimiento",
						type: "date",
						icon: <EventIcon />,
						required: true,
					},
				],
			],
		},
		{
			title: "Datos del usuario",
			fields: [
				[
					{
						label: "Email",
						name: "email",
						type: "email",
						icon: <MailOutlineIcon />,
						required: true,
					},
				],
				[
					{
						label: "Nombre de usuario",
						name: "username",
						type: "text",
						icon: <AccountCircleIcon />,
						required: true,
					},
					{
						label: "Rol",
						name: "rol",
						type: "select",
						options: Object.values(Rol)
							.filter((value) => isNaN(Number(value)) && value != "Superadmin")
							.map(String),
						icon: <AccountCircleIcon />,
						required: true,
					},
				],
			],
		},
		{
			title: "Imagen de perfil",
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
								validationSchema={empleadoSchema}
								onSubmit={handleSubmitEmpleado}
								submitButtonText={"Siguiente"}
							/>
						);
					case 1:
						return (
							<GenericForm
								fields={steps[1].fields}
								initialValues={initialValues}
								validationSchema={usuarioSchema}
								onBack={handleBack}
								onSubmit={handleSubmitUsuario}
								submitButtonText="Siguiente"
							/>
						);
					case 2:
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
