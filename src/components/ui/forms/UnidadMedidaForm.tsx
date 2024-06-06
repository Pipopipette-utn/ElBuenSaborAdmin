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
	onShowSuccess: (message: string) => void;
	onShowError: (message: string) => void;
}

export const UnidadMedidaForm: FC<unidadMedidaFormProps> = ({
	unidadMedida,
	onClose,
	onShowSuccess,
	onShowError,
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
				onShowSuccess("Unidad de medida editada con éxito!");
			} else {
				const updatedUnidad = await unidadMedidaService.create(newUnidadMedida);
				dispatch(addUnidadMedida(updatedUnidad));
				onShowSuccess("Unidad de medida creada con éxito!");
			}
			onClose();
		} catch (error: any) {
			onShowError("Error en el alta de unidad de medida: " + error);
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
