import * as Yup from "yup";
import { FC, useState } from "react";

import StoreIcon from "@mui/icons-material/Store";
import FaceIcon from "@mui/icons-material/Face";
import SignpostIcon from "@mui/icons-material/Signpost";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import TagIcon from "@mui/icons-material/Tag";

import { GenericForm } from "../shared/GenericForm";
import { ISucursal } from "../../../types/empresa";
import { IStep } from "../../../types/business";
import FormStepper from "../shared/FormStepper";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { UbicacionForm } from "./UbicacionForm";
import { useUbicacion } from "../../../hooks/useUbicacion";
import { IDomicilio, UbicacionContext } from "../../../types/ubicacion";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { SucursalService } from "../../../services/SucursalService";
import { setSucursalesEmpresa } from "../../../redux/slices/SelectedData";
import { setSucursales } from "../../../redux/slices/Business";
import { DomicilioService } from "../../../services/DomicilioService";

interface SucursalFormProps {
	sucursal: ISucursal;
	onClose: Function;
}

export const SucursalForm: FC<SucursalFormProps> = ({ sucursal, onClose }) => {
	const [activeStep, setActiveStep] = useState(0);
	const dispatch = useAppDispatch();
	const empresa = useAppSelector((state) => state.selectedData.empresa);

	const pais = sucursal.domicilio
		? sucursal.domicilio.localidad!.provincia!.pais!
		: undefined;
	const provincia = sucursal.domicilio
		? sucursal.domicilio.localidad!.provincia!
		: undefined;
	const localidad = sucursal.domicilio
		? sucursal.domicilio.localidad!
		: undefined;

	const ubicacionData = useUbicacion(pais, provincia, localidad);

	const initialValues = {
		...sucursal,
		horarioApertura: dayjs(`2024-05-13T${sucursal.horarioApertura}`),
		horarioCierre: dayjs(`2024-05-13T${sucursal.horarioCierre}`),
		cp: sucursal.domicilio ? sucursal.domicilio.cp : "",
		calle: sucursal.domicilio ? sucursal.domicilio.calle : "",
		numero: sucursal.domicilio ? sucursal.domicilio.numero : "",
		piso: sucursal.domicilio ? sucursal.domicilio.piso : "",
		nroDpto: sucursal.domicilio ? sucursal.domicilio.nroDpto : "",
	};

	let sucursalSchemaDatosSucursal: Yup.ObjectSchema<
		any,
		Yup.AnyObject,
		any,
		""
	> = Yup.object().shape({
		nombre: Yup.string().trim().required("Este campo es requerido."),
		horarioApertura: Yup.string().required("Este campo es requerido."),
		horarioCierre: Yup.string().required("Este campo es requerido."),
		icon: Yup.string(),
	});

	let sucursalSchemaUbicacion: Yup.ObjectSchema<any, Yup.AnyObject, any, ""> =
		Yup.object().shape({
			cp: Yup.number()
				.typeError("Este campo sólo puede tener números")
				.required("Este campo es requerido."),
			calle: Yup.string().required("Este campo es requerido."),
			numero: Yup.number()
				.typeError("Este campo sólo puede tener números")
				.required("Este campo es requerido."),
			piso: Yup.number().typeError("Este campo sólo puede tener números"),
			nroDpto: Yup.number().typeError("Este campo sólo puede tener números"),
		});

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const domicilioService = new DomicilioService("/domicilios");
			let domicilio: IDomicilio = {
				baja: false,
				cp: values.cp,
				calle: values.calle,
				numero: values.numero,
				piso: values.piso,
				nroDpto: values.piso,
				localidadId: ubicacionData["localidad"]?.id!,
			};

			if (values.id) {
				domicilio = await domicilioService.update(values.id, domicilio);
			} else {
				domicilio = await domicilioService.create(domicilio);
			}

			const sucursalService = new SucursalService("/sucursales");
			const sucursal: ISucursal = {
				empresaId: empresa!.id,
				baja: false,
				nombre: values.nombre,
				horarioApertura: values.horarioApertura,
				horarioCierre: values.horarioCierre,
				icon: values.icon,
				domicilioId: domicilio.id,
			};

			if (values.id) {
				await sucursalService.update(values.id, sucursal);
			} else {
				await sucursalService.create(sucursal);
			}
			const sucursales = await sucursalService.getAll();
			dispatch(setSucursales(sucursales));
			dispatch(
				setSucursalesEmpresa(
					sucursales.filter((s) => s.empresa!.id == empresa!.id)
				)
			);
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const steps: IStep[] = [
		{
			title: "Datos de la sucursal",
			fields: [
				[
					{
						label: "Nombre",
						name: "nombre",
						type: "text",
						icon: <StoreIcon />,
						required: true,
					},
					{
						label: "Horario de apertura",
						name: "horarioApertura",
						type: "time",
						required: true,
					},
					{
						label: "Horario de cierre",
						name: "horarioCierre",
						type: "time",
						required: true,
					},
				],
				[{ label: "Logo", name: "icon", type: "text", icon: <FaceIcon /> }],
			],
		},
		{
			title: "Ubicación",
			fields: [
				[
					{
						label: "Calle",
						name: "calle",
						type: "text",
						icon: <AddRoadIcon />,
						required: true,
					},
					{
						label: "Numero",
						name: "numero",
						type: "text",
						icon: <SignpostIcon />,
						required: true,
					},
				],
				[
					{
						label: "Código postal",
						name: "cp",
						type: "text",
						icon: <TagIcon />,
						required: true,
					},
					{
						label: "Piso",
						name: "piso",
						type: "number",
						icon: <LocationCityIcon />,
					},
					{
						label: "Numero de departamento",
						name: "nroDpto",
						type: "number",
						icon: <TagIcon />,
					},
				],
			],
		},
	];

	return (
		<Stack alignItems="center" spacing={3}>
			<Stack width={"80%"} marginBottom={2}>
				<FormStepper steps={steps} activeStep={activeStep} />
			</Stack>
			<UbicacionContext.Provider value={ubicacionData}>
				{activeStep === 1 && <UbicacionForm />}
			</UbicacionContext.Provider>
			<GenericForm
				fields={steps[activeStep].fields}
				initialValues={initialValues}
				validationSchema={
					activeStep === 0
						? sucursalSchemaDatosSucursal
						: sucursalSchemaUbicacion
				}
				onBack={activeStep > 0 ? handleBack : undefined}
				onSubmit={
					activeStep === steps.length - 1 ? handleSubmitForm : handleNext
				}
				submitButtonText={
					activeStep !== steps.length - 1
						? "Continuar"
						: sucursal.id
						? "Editar sucursal"
						: "Crear sucursal"
				}
			/>
		</Stack>
	);
};
