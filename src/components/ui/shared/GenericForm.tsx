import { Formik } from "formik";
import * as Yup from "yup";
import {
	Button,
	InputAdornment,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { FC, useState } from "react";
import { ErrorTypography, TextFieldStack } from "../styled/StyledForm";
import { IField } from "../../../types/business";

interface FormProps {
	fields: IField[][];
	initialValues: { [key: string]: any };
	validationSchema: Yup.ObjectSchema<any>;
	onSubmit: (values: { [key: string]: any }) => void | Promise<any>;
	onBack?: () => void;
	submitButtonText: string;
}

export const GenericForm: FC<FormProps> = ({
	fields,
	initialValues,
	validationSchema,
	onSubmit,
	onBack,
	submitButtonText,
}) => {
	const [error, setError] = useState("");

	return (
		<Stack
			direction="column"
			spacing={2}
			sx={{
				alignItems: "center",
			}}
		>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={async (values, _actions) => {
					try {
						await onSubmit(values);
					} catch (ex: any) {
						setError(ex.message);
					}
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<>
						{fields.map((field, index) => {
							return (
								<Stack direction="row" width="100%" spacing={2} key={index}>
									{field.map((f) => (
										<TextFieldStack key={f.name} spacing={1}>
											<Typography>
												{f.label}:
												{f.required && <span style={{ color: "red" }}> *</span>}
											</Typography>
											{(() => {
												switch (f.type) {
													case "text":
													case "number":
														return (
															<TextField
																type={f.type}
																fullWidth
																placeholder={f.label.toUpperCase()}
																name={f.name}
																value={values[f.name]}
																onChange={handleChange}
																onBlur={handleBlur}
																InputProps={{
																	startAdornment: (
																		<InputAdornment position="start">
																			{f.icon!}
																		</InputAdornment>
																	),
																}}
															/>
														);
													case "select":
														return (
															<Select
																fullWidth
																name={f.name}
																value={values[f.name]}
																onChange={handleChange}
															>
																{f.options!.map((option, index) => (
																	<MenuItem key={index} value={option}>
																		{option}
																	</MenuItem>
																))}
															</Select>
														);
													case "time":
														return (
															<LocalizationProvider dateAdapter={AdapterDayjs}>
																<TimePicker
																	name={f.name}
																	value={values[f.name]}
																	onChange={handleChange}
																/>
															</LocalizationProvider>
														);
													default:
														return null;
												}
											})()}
											{touched[f.name] && errors[f.name] && (
												<ErrorTypography>
													{String(errors[f.name])}
												</ErrorTypography>
											)}
										</TextFieldStack>
									))}
								</Stack>
							);
						})}
						{error && <ErrorTypography> {error}</ErrorTypography>}
						<Stack direction="row" width="100%" spacing={2}>
							{onBack && (
								<Button
									variant="outlined"
									sx={{ py: 1, px: 4, textTransform: "uppercase" }}
									onClick={onBack}
								>
									Volver
								</Button>
							)}
							<Button
								variant="contained"
								type="submit"
								fullWidth
								sx={{ py: 1.5, px: 4, textTransform: "uppercase" }}
								disabled={isSubmitting}
								onClick={(event) => {
									event.preventDefault();
									handleSubmit();
								}}
							>
								{submitButtonText}
							</Button>
						</Stack>
					</>
				)}
			</Formik>
		</Stack>
	);
};
