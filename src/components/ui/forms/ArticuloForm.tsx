import * as Yup from "yup";
import { FC } from "react";
import { IArticulo } from "../../../types/empresa";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import ScaleIcon from "@mui/icons-material/Scale";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { GenericForm } from "../shared/GenericForm";
import { IField } from "../../../types/business";
import { useAppSelector } from "../../../redux/hooks";

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
	const categorias = useAppSelector((state) => state.business.categorias);
	const unidadesMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);

	const initialValues = {
		...articulo,
		unidadMedida: articulo.unidadMedida
			? articulo.unidadMedida.denominacion
			: "",
		categoria: articulo.categoria ? articulo.categoria.denominacion : "",
		imagen:
			articulo.imagenes && articulo.imagenes.length > 0
				? articulo.imagenes![0].url
				: "",
	};

	let articuloSchema = Yup.object().shape({
		denominacion: Yup.string().trim().required("Este campo es requerido."),
		unidadMedida: Yup.string().required("Este campo es requerido."),
		imagen: Yup.string(),
	});

	const handleSubmit = async (values: { [key: string]: any }) => {
		try {
			const unidadMedida = unidadesMedida!.find(
				(unidad) => unidad.denominacion! == values.unidadMedida
			);
			let newArticulo;
			if (values.categoria) {
				const categoria = categorias!.find(
					(cat) => cat.denominacion! == values.categoria
				);
				newArticulo = {
					...articulo,
					denominacion: values.denominacion,
					imagenes: values.imagen
						? [{ baja: false, url: values.imagen }]
						: undefined,
					unidadMedida,
					categoria: values.categoria !== "" ? categoria : undefined,
				};
			} else {
				newArticulo = {
					...articulo,
					denominacion: values.denominacion,
					imagenes: values.imagen
						? [{ baja: false, url: values.imagen }]
						: undefined,
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
		[
			{
				label: "Imagen",
				name: "imagen",
				type: "text",
				icon: <BurstModeIcon />,
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
				options: categorias?.map(
					(categoria) => categoria.denominacion
				),
				icon: <LocalOfferIcon />,
				required: true,
			},
		],
		[
			{
				label: "Imagen",
				name: "imagen",
				type: "text",
				icon: <BurstModeIcon />,
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
