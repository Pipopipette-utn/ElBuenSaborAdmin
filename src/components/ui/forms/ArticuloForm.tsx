import * as Yup from "yup";
import { FC, useState } from "react";
import { IArticulo, ICategoria } from "../../../types/empresa";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import ScaleIcon from "@mui/icons-material/Scale";

import { GenericForm } from "../shared/GenericForm";
import { IField } from "../../../types/business";
import { useAppSelector } from "../../../redux/hooks";
import { mapCategories } from "../../../utils/mapCategorias";
import { ErrorTypography, TextFieldStack } from "../styled/StyledForm";
import { Autocomplete, TextField, Typography } from "@mui/material";

interface ArticuloFormProps {
	articulo: IArticulo;
	handleSubmitForm: (d: IArticulo) => void;
	isManufacturado?: boolean;
	categoria?: ICategoria | null;
	submitButtonText: string;
}

export const ArticuloForm: FC<ArticuloFormProps> = ({
	articulo,
	handleSubmitForm,
	isManufacturado,
	categoria,
	submitButtonText,
}) => {
	const categorias = useAppSelector(
		(state) => state.selectedData.categoriasSucursal
	);
	const unidadesMedida = useAppSelector(
		(state) => state.business.unidadMedidas
	);
	const [selectedCategoria, setSelectedCategoria] = useState(categoria);
	const [errorCategoria, setErrorCategoria] = useState<null | string>(null);

	let mappedCategorias =
		categorias && categorias !== "loading" ? categorias : [];
	if (categorias !== "loading")
		mappedCategorias = mapCategories(categorias, false, true);

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
			const unidadMedida =
				unidadesMedida && unidadesMedida != "loading"
					? unidadesMedida!.find(
							(unidad) => unidad.denominacion! == values.unidadMedida
					  )
					: undefined;

			let newArticulo;
			if (selectedCategoria) {
				newArticulo = {
					...articulo,
					denominacion: values.denominacion,
					unidadMedida,
					categoria: selectedCategoria,
				};
			} else {
				newArticulo = {
					...articulo,
					denominacion: values.denominacion,
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
				options:
					unidadesMedida && unidadesMedida != "loading"
						? unidadesMedida?.map((unidad) => unidad.denominacion)
						: [],
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
			{
				label: "Unidad de medida",
				name: "unidadMedida",
				type: "select",
				options:
					unidadesMedida && unidadesMedida != "loading"
						? unidadesMedida?.map((unidad) => unidad.denominacion)
						: [],
				icon: <ScaleIcon />,
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
			childrenPosition="bottom"
		>
			{isManufacturado && (
				<TextFieldStack alignItems="center" spacing={1} width="50%">
					<Typography>Categoría</Typography>
					<Autocomplete
						fullWidth
						options={mappedCategorias}
						value={selectedCategoria}
						onChange={(_event, newValue) => {
							setErrorCategoria(null);
							setSelectedCategoria(newValue);
						}}
						getOptionLabel={(option) => option.denominacion}
						renderInput={(params) => (
							<TextField {...params} variant="outlined" />
						)}
					/>
					{errorCategoria && (
						<ErrorTypography>Este campo es requerido</ErrorTypography>
					)}
				</TextFieldStack>
			)}
		</GenericForm>
	);
};
