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
import { IDomicilio } from "../../../types/ubicacion";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { SucursalService } from "../../../services/SucursalService";
import {
	addSucursalEmpresa,
	editSucursalEmpresa,
} from "../../../redux/slices/SelectedData";
import { addSucursal, editSucursal } from "../../../redux/slices/Business";
import { emptyDomicilio } from "../../../types/emptyEntities";
import { DomicilioForm } from "./DomicilioForm";

interface SucursalFormProps {
	initialSucursal: ISucursal;
	onClose: Function;
}

// En este componente uso un stepper ya que tiene 2 pasos el formulario: el de los datos de la sucursal
// y el de la ubicacion.
export const SucursalForm: FC<SucursalFormProps> = ({
	initialSucursal,
	onClose,
}) => {
	const [sucursal, setSucursal] = useState(initialSucursal);
	const [activeStep, setActiveStep] = useState(0);

	const dispatch = useAppDispatch();
	const empresa = useAppSelector((state) => state.selectedData.empresa);

	const initialValues = {
		...sucursal,
		horarioApertura: dayjs(`2024-05-13T${sucursal.horarioApertura}`),
		horarioCierre: dayjs(`2024-05-13T${sucursal.horarioCierre}`),
	};

	let validationSchema: Yup.ObjectSchema<any, Yup.AnyObject, any, ""> =
		Yup.object().shape({
			nombre: Yup.string().trim().required("Este campo es requerido."),
			horarioApertura: Yup.string().required("Este campo es requerido."),
			horarioCierre: Yup.string().required("Este campo es requerido."),
			icon: Yup.string(),
		});

	const handleBack = () => setActiveStep((prev) => prev - 1);
	const handleNext = () => setActiveStep((prev) => prev + 1);

	const handleNextForm = (values: { [key: string]: any }) => {
		handleNext();
		const newSucursal = {
			...sucursal,
			nombre: values.nombre,
			horarioApertura: values.horarioApertura.format("HH:mm:ss"),
			horarioCierre: values.horarioCierre.format("HH:mm:ss"),
			icon: values.icon,
		};
		setSucursal(newSucursal);
	};

	const handleSubmitForm = async (domicilio: IDomicilio) => {
		try {
			if (!empresa) throw new Error("No se ha seleccionado la empresa");

			const sucursalService = new SucursalService("/sucursal");
			//Si está siendo editado, ya viene con empresa y domicilio, se lo borro
			const newSucursal = {
				...sucursal,
				empresa: undefined,
				domicilio: undefined,
				empresaId: empresa!.id,
				baja: false,
				domicilioId: domicilio.id,
			};

			const sucursalUpdated = {
				...newSucursal,
				empresa: empresa!,
				domicilio: domicilio,
			};

			if (sucursal.id) {
				await sucursalService.update(sucursal.id, newSucursal);
				dispatch(editSucursal(sucursalUpdated));
				dispatch(editSucursalEmpresa(sucursalUpdated));
			} else {
				await sucursalService.create(newSucursal);
				dispatch(addSucursal(sucursalUpdated));
				dispatch(addSucursalEmpresa(sucursalUpdated));
			}

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
			{activeStep === 0 && (
				<GenericForm
					fields={steps[activeStep].fields}
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleNextForm}
					submitButtonText={
						activeStep !== steps.length - 1
							? "Continuar"
							: sucursal.id
							? "Editar sucursal"
							: "Crear sucursal"
					}
				/>
			)}
			{activeStep === 1 && (
				<DomicilioForm
					domicilio={sucursal.domicilio ?? emptyDomicilio}
					fields={steps[1].fields}
					handleBack={handleBack}
					handleSubmitForm={handleSubmitForm}
					submitButtonText={sucursal.id ? "Editar sucursal" : "Crear sucursal"}
				/>
			)}
		</Stack>
	);
};
