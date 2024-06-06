import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { ErrorTypography, TextFieldStack } from "../styled/StyledForm";
import {
	ILocalidad,
	IProvincia,
	UbicacionContext,
	UbicacionContextValues,
} from "../../../types/ubicacion";
import { useAppSelector } from "../../../redux/hooks";

export const UbicacionForm = () => {
	const paises = useAppSelector((state) => state.location.paises);
	const provincias = useAppSelector((state) => state.location.provincias);
	const localidades = useAppSelector((state) => state.location.localidades);
	const [filteredProvincias, setFilteredProvincias] = useState<IProvincia[]>(
		provincias ?? []
	);
	const [filteredLocalidades, setFilteredLocalidades] = useState<ILocalidad[]>(
		localidades ?? []
	);

	useEffect(() => {
		if (provincias)
			setFilteredProvincias(provincias);
		if (localidades)
		setFilteredLocalidades(localidades);
	}, [provincias, localidades]);

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
		if (pais && provincias) {
			const filteredProvincias = provincias.filter((provincia: IProvincia) => {
				return provincia.pais?.id == pais.id;
			});
			setFilteredProvincias(filteredProvincias ?? []);
		}
	}, [pais]);

	// Filtrar las localidades según la provincia seleccionada
	useEffect(() => {
		if (provincia && localidades) {
			const filteredLocalidades = localidades.filter(
				(localidad: ILocalidad) => localidad.provincia?.id == provincia.id
			);
			setFilteredLocalidades(filteredLocalidades ?? []);
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
				<Stack direction="row" width="80%" spacing={3}>
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
							{paises === null || paises.length === 0 ? (
								<MenuItem disabled>Cargando...</MenuItem>
							) : (
								paises!.map((option, index) => (
									<MenuItem key={index} value={option.id}>
										{option.nombre}
									</MenuItem>
								))
							)}
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
								const selectedProvincia = filteredProvincias!.find(
									(provincia) => provincia.id! == e.target.value
								);
								onChangeProvincia(selectedProvincia!);
							}}
						>
							{values["pais"] === "" ? (
								<MenuItem disabled value="">
									Seleccione un país
								</MenuItem>
							) : filteredProvincias.length === 0 ? (
								<MenuItem disabled>Cargando...</MenuItem>
							) : (
								filteredProvincias!.map((option, index) => (
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
								const selectedLocalidad = filteredLocalidades!.find(
									(localidad) => localidad.id! == e.target.value
								);
								onChangeLocalidad(selectedLocalidad!);
							}}
						>
							{values["provincia"] === "" ? (
								<MenuItem disabled value="">
									Seleccione una provincia
								</MenuItem>
							) : filteredLocalidades.length === 0 ? (
								<MenuItem disabled>Cargando...</MenuItem>
							) : (
								filteredLocalidades!.map((option, index) => (
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
