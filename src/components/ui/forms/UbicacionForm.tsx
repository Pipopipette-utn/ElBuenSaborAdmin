import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";

import { useAppSelector } from "../../../redux/hooks";
import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { ErrorTypography, TextFieldStack } from "../styled/StyledForm";
import {
	ILocalidad,
	IProvincia,
	UbicacionContext,
	UbicacionContextValues,
} from "../../../types/ubicacion";

export const UbicacionForm = () => {
	const paises = useAppSelector((state) => state.location.paises);
	const todasProvincias = useAppSelector((state) => state.location.provincias);
	const todasLocalidades = useAppSelector(
		(state) => state.location.localidades
	);

	const [provincias, setProvincias] = useState<IProvincia[]>(todasProvincias!);
	const [localidades, setLocalidades] = useState<ILocalidad[]>(
		todasLocalidades!
	);

	const {
		pais,
		provincia,
		localidad,
		onChangePais,
		onChangeProvincia,
		onChangeLocalidad,
	} = useContext(UbicacionContext) as UbicacionContextValues;

	// Filtrar las provincias según el país seleccionado
	useEffect(() => {
		if (pais) {
			const filteredProvincias = todasProvincias!.filter((provincia) => {
				return provincia.pais?.id == pais.id;
			});
			setProvincias(filteredProvincias);
		}
	}, [pais]);

	// Filtrar las localidades según la provincia seleccionada
	useEffect(() => {
		if (provincia) {
			const filteredLocalidades = todasLocalidades!.filter(
				(localidad) => localidad.provincia?.id == provincia.id
			);
			setLocalidades(filteredLocalidades);
		}
	}, [provincia]);

	const initialValues = {
		pais: pais ? pais.id : "",
		provincia: provincia?.id ?? "",
		localidad: localidad?.id ?? "",
	};

	let validationSchema: Yup.ObjectSchema<any, Yup.AnyObject, any, ""> =
		Yup.object().shape({
			pais: Yup.string().required("Este campo es requerido."),
			provincia: Yup.string().required("Este campo es requerido."),
			localidad: Yup.string().required("Este campo es requerido."),
		});

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={() => {}}
		>
			{({ values, errors, touched, handleChange }) => (
				<Stack direction="row" width="100%" spacing={3}>
					<TextFieldStack spacing={1}>
						<Typography>
							Pais: <span style={{ color: "red" }}> *</span>
						</Typography>
						<Select
							fullWidth
							name="pais"
							value={values["pais"]}
							onChange={(e) => {
								handleChange(e);
								const selectedPais = paises!.find(
									(pais) => pais.id! == e.target.value
								);
								onChangePais(selectedPais!);
							}}
						>
							{paises!.map((option, index) => (
								<MenuItem key={index} value={option.id}>
									{option.nombre}
								</MenuItem>
							))}
						</Select>
						{touched["pais"] && errors["pais"] && (
							<ErrorTypography>{String(errors["pais"])}</ErrorTypography>
						)}
					</TextFieldStack>
					<TextFieldStack spacing={1}>
						<Typography>
							Provincia: <span style={{ color: "red" }}> *</span>
						</Typography>
						<Select
							fullWidth
							name={"provincia"}
							value={values["provincia"]}
							onChange={(e) => {
								handleChange(e);
								const selectedProvincia = provincias!.find(
									(provincia) => provincia.id! == e.target.value
								);
								onChangeProvincia(selectedProvincia!);
							}}
						>
							{values["pais"] === "" ? (
								<MenuItem disabled value="">
									Seleccione un país
								</MenuItem>
							) : (
								provincias!.map((option, index) => (
									<MenuItem key={index} value={option.id}>
										{option.nombre}
									</MenuItem>
								))
							)}
						</Select>
						{touched["provincia"] && errors["provincia"] && (
							<ErrorTypography>{String(errors["provincia"])}</ErrorTypography>
						)}
					</TextFieldStack>
					<TextFieldStack spacing={1}>
						<Typography>
							Localidad: <span style={{ color: "red" }}> *</span>
						</Typography>
						<Select
							fullWidth
							name={"localidad"}
							value={values["localidad"]}
							onChange={(e) => {
								handleChange(e);
								const selectedLocalidad = localidades!.find(
									(localidad) => localidad.id! == e.target.value
								);
								onChangeLocalidad(selectedLocalidad!);
							}}
						>
							{values["provincia"] === "" ? (
								<MenuItem disabled value="">
									Seleccione una provincia
								</MenuItem>
							) : (
								localidades!.map((option, index) => (
									<MenuItem key={index} value={option.id}>
										{option.nombre}
									</MenuItem>
								))
							)}
						</Select>
						{touched["localidad"] && errors["localidad"] && (
							<ErrorTypography>{String(errors["localidad"])}</ErrorTypography>
						)}
					</TextFieldStack>
				</Stack>
			)}
		</Formik>
	);
};
