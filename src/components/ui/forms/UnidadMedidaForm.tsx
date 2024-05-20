import * as Yup from "yup";
import { FC } from "react";
import StraightenIcon from "@mui/icons-material/Straighten";
import { useAppDispatch } from "../../../redux/hooks";
import { IField } from "../../../types/business";
import { IUnidadMedida } from "../../../types/empresa";
import { UnidadMedidaService } from "../../../services/UnidadMedidaService";
import {
	addUnidadMedida,
	editUnidadMedida,
} from "../../../redux/slices/Business";
import { GenericForm } from "../shared/GenericForm";

interface unidadMedidaFormProps {
	unidadMedida: IUnidadMedida;
	onClose: Function;
}

export const UnidadMedidaForm: FC<unidadMedidaFormProps> = ({
	unidadMedida,
	onClose,
}) => {
	const dispatch = useAppDispatch();

	const initialValues = {
		...unidadMedida,
	};

	let unidadMedidaSchema = Yup.object().shape({
		denominacion: Yup.string().trim().required("Este campo es requerido."),
	});

	const handleSubmitForm = async (values: { [key: string]: any }) => {
		try {
			const unidadMedidaService = new UnidadMedidaService("/unidadesMedidas");
			const newUnidadMedida: IUnidadMedida = {
				...unidadMedida,
				...values,
			};

			if (values.id) {
				const updatedUnidad = await unidadMedidaService.update(
					values.id,
					newUnidadMedida
				);
				dispatch(editUnidadMedida(updatedUnidad));
			} else {
				const updatedUnidad = await unidadMedidaService.create(newUnidadMedida);
				dispatch(addUnidadMedida(updatedUnidad));
			}
			onClose();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const fields: IField[][] = [
		[
			{
				label: "Denominación",
				name: "denominacion",
				type: "text",
				icon: <StraightenIcon />,
				required: true,
			},
		],
	];

	return (
		<GenericForm
			fields={fields}
			initialValues={initialValues}
			validationSchema={unidadMedidaSchema}
			onSubmit={handleSubmitForm}
			childrenPosition="bottom"
			submitButtonText={
				unidadMedida.id ? "Editar unidad de medida" : "Crear unidad de medida"
			}
		/>
	);
};
