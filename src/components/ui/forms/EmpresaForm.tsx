import * as Yup from "yup";
import { FC } from "react";
import { IEmpresa } from "../../../types/empresa";

import BadgeIcon from "@mui/icons-material/Badge";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FaceIcon from "@mui/icons-material/Face";
import { GenericForm } from "../shared/GenericForm";
import { EmpresaService } from "../../../services/EmpresaService";
import { useAppDispatch } from "../../../redux/hooks";
import { setEmpresas } from "../../../redux/slices/Business";
import { IField } from "../../../types/business";

interface EmpresaFormProps {
	empresa: IEmpresa;
	onClose: Function;
}

export const EmpresaForm: FC<EmpresaFormProps> = ({ empresa, onClose }) => {
	const dispatch = useAppDispatch();

	const initialValues = {
		...empresa,
		cuil: empresa.cuil == 0 ? "" : empresa.cuil,
	};

	let empresaSchema = Yup.object().shape({
		nombre: Yup.string().trim().required("Este campo es requerido."),
		razonSocial: Yup.string().required("Este campo es requerido."),
		cuil: Yup.number()
			.typeError("El campo sólo puede tener números")
			.required("Este campo es requerido."),
		icon: Yup.string(),
	});

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const empresaService = new EmpresaService("/empresa");
			const empresa: IEmpresa = {
				baja: false,
				nombre: values.nombre,
				razonSocial: values.razonSocial,
				cuil: values.cuil,
				icon: values.icon,
			};

			if (values.id) {
				await empresaService.update(values.id, empresa);
			} else {
				await empresaService.create(empresa);
			}
			const empresas = await empresaService.getAll();
			dispatch(setEmpresas(empresas));
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const fields: IField[][] = [
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

		[{ label: "Logo", name: "icon", type: "text", icon: <FaceIcon /> }],
	];

	return (
		<GenericForm
			fields={fields}
			initialValues={initialValues}
			validationSchema={empresaSchema}
			onSubmit={handleSubmitForm}
			submitButtonText={empresa.id ? "Editar empresa" : "Crear empresa"}
		/>
	);
};
