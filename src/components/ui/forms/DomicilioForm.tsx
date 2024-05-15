import * as Yup from "yup";
import { FC } from "react";
import { GenericForm } from "../shared/GenericForm";
import { IField } from "../../../types/business";
import { UbicacionForm } from "./UbicacionForm";
import { useUbicacion } from "../../../hooks/useUbicacion";
import { IDomicilio, UbicacionContext } from "../../../types/ubicacion";

interface DomicilioFormProps {
	domicilio: IDomicilio;
	fields: IField[][];
	handleBack: () => void;
	handleSubmitForm: (d: IDomicilio) => void;
	submitButtonText: string;
}

// En este componente uso un stepper ya que tiene 2 pasos el formulario: el de los datos de la sucursal
// y el de la ubicacion.
export const DomicilioForm: FC<DomicilioFormProps> = ({
	domicilio,
	fields,
	handleBack,
	handleSubmitForm,
	submitButtonText,
}) => {
	const pais = domicilio.localidad
		? domicilio.localidad!.provincia!.pais!
		: undefined;
	const provincia = domicilio.localidad
		? domicilio.localidad!.provincia!
		: undefined;
	const localidad = domicilio.localidad ? domicilio.localidad! : undefined;

	const ubicacionData = useUbicacion(pais, provincia, localidad);

	const initialValues = {
		cp: domicilio.cp,
		calle: domicilio.calle,
		numero: domicilio.numero,
		piso: domicilio.piso ?? "",
		nroDpto: domicilio.nroDpto ?? "",
	};

	let validationSchema: Yup.ObjectSchema<any, Yup.AnyObject, any, ""> =
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

	const handleSubmit = async (values: { [key: string]: any }) => {
		let newDomicilio: IDomicilio = {
			... domicilio,
			eliminado: false,
			cp: values.cp,
			calle: values.calle,
			numero: values.numero,
			piso: values.piso,
			nroDpto: values.piso,
			localidad: ubicacionData["localidad"],
		};

		handleSubmitForm(newDomicilio);
	};

	return (
		<>
			<UbicacionContext.Provider value={ubicacionData}>
				<UbicacionForm />
			</UbicacionContext.Provider>
			<GenericForm
				fields={fields}
				initialValues={initialValues}
				validationSchema={validationSchema}
				onBack={handleBack}
				onSubmit={handleSubmit}
				submitButtonText={submitButtonText}
			/>
		</>
	);
};
