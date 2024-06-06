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
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

export const EmpresaForm: FC<EmpresaFormProps> = ({
	empresa,
	onClose,
	onShowSuccess,
	onShowError,
}) => {
	const dispatch = useAppDispatch();

	const initialValues = {
		...empresa,
		cuil: empresa.cuil == 0 ? "" : empresa.cuil,
		logo: empresa.logo == null ? "" : empresa.logo,
	};

	let empresaSchema = Yup.object().shape({
		nombre: Yup.string().trim().required("Este campo es requerido."),
		razonSocial: Yup.string().required("Este campo es requerido."),
		cuil: Yup.string()
			.matches(/^[0-9]+$/, "El campo sólo puede tener números")
			.min(10, "El CUIL debe tener al menos 10 caracteres.")
			.required("Este campo es requerido."),
		logo: Yup.string(),
	});

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const empresaService = new EmpresaService("/empresas");
			const newEmpresa: IEmpresa = {
				...empresa,
				baja: false,
				nombre: values.nombre,
				razonSocial: values.razonSocial,
				cuil: values.cuil,
				logo: values.logo,
			};

			if (values.id) {
				await empresaService.update(values.id, newEmpresa);
				onShowSuccess("Empresa editada con éxito!");
			} else {
				await empresaService.create(newEmpresa);
				onShowSuccess("Empresa creada con éxito!");
			}
			const empresas = await empresaService.getAll();
			dispatch(setEmpresas(empresas));
			onClose();
		} catch (error: any) {
			onShowError("Error en el alta de empresa: " + error);
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

		[{ label: "Logo", name: "logo", type: "text", icon: <FaceIcon /> }],
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
