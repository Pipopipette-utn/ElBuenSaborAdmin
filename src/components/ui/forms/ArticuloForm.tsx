import * as Yup from "yup";
import { FC } from "react";
import { IArticulo } from "../../../types/empresa";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import ScaleIcon from "@mui/icons-material/Scale";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { GenericForm } from "../shared/GenericForm";
import { IField } from "../../../types/business";
import { useAppSelector } from "../../../redux/hooks";
import { findCategory, mapCategories } from "../../../utils/mapCategorias";

interface ArticuloFormProps {
	articulo: IArticulo;
	handleSubmitForm: (d: IArticulo) => void;
	isManufacturado?: boolean;
	submitButtonText: string;
}

export const ArticuloForm: FC<ArticuloFormProps> = ({
	articulo,
	handleSubmitForm,
	isManufacturado,
	submitButtonText,
}) => {
	const categorias = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);
	const unidadesMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);

	const initialValues = {
		...articulo,
		unidadMedida: articulo.unidadMedida
			? articulo.unidadMedida.denominacion
			: "",
		categoria: articulo.categoria ? articulo.categoria.denominacion : "",
	};

	let articuloSchema = Yup.object().shape({
		denominacion: Yup.string().trim().required("Este campo es requerido."),
		unidadMedida: Yup.string().required("Este campo es requerido."),
	});

	const handleSubmit = async (values: { [key: string]: any }) => {
		try {
			const unidadMedida = unidadesMedida!.find(
				(unidad) => unidad.denominacion! == values.unidadMedida
			);
			let newArticulo;
			if (values.categoria) {
				const categoria = findCategory(categorias, values.categoria);
				newArticulo = {
					...articulo,
					denominacion: values.denominacion,
					unidadMedida,
					categoria: values.categoria !== "" ? categoria : undefined,
				};
			} else {
				newArticulo = {
					...articulo,
					denominacion: values.denominacion,
					imagenes: [],
					unidadMedida,
				};
			}

			handleSubmitForm(newArticulo);
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const articuloFields: IField[][] = [
		[
			{
				label: "Denominacion",
				name: "denominacion",
				type: "text",
				icon: <FastfoodIcon />,
				required: true,
			},
			{
				label: "Unidad de medida",
				name: "unidadMedida",
				type: "select",
				options: unidadesMedida?.map((unidad) => unidad.denominacion),
				icon: <ScaleIcon />,
				required: true,
			},
		],
	];

	const articuloManufacturadoFields: IField[][] = [
		[
			{
				label: "Denominacion",
				name: "denominacion",
				type: "text",
				icon: <FastfoodIcon />,
				required: true,
			},
		],
		[
			{
				label: "Unidad de medida",
				name: "unidadMedida",
				type: "select",
				options: unidadesMedida?.map((unidad) => unidad.denominacion),
				icon: <ScaleIcon />,
				required: true,
			},
			{
				label: "Categoría",
				name: "categoria",
				type: "select",
				options: mapCategories(categorias, false),
				icon: <LocalOfferIcon />,
				required: true,
			},
		],
	];

	return (
		<GenericForm
			fields={isManufacturado ? articuloManufacturadoFields : articuloFields}
			initialValues={initialValues}
			validationSchema={articuloSchema}
			onSubmit={handleSubmit}
			submitButtonText={submitButtonText}
		/>
	);
};
