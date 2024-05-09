import { Formik } from "formik";
import * as Yup from "yup";
import {
	Button,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FC, ReactElement, useState } from "react";
import { ErrorTypography, TextFieldStack } from "../styled/StyledForm";

interface FieldProps {
	label: string;
	name: string;
	icon: ReactElement;
	required?: boolean;
}

interface FormProps {
	fields: FieldProps[][];
	initialValues: { [key: string]: any };
	validationSchema: Yup.ObjectSchema<any>;
	onSubmit: (values: { [key: string]: any }) => void | Promise<any>;
	submitButtonText: string;
}

export const GenericForm: FC<FormProps> = ({
	fields,
	initialValues,
	validationSchema,
	onSubmit,
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
												{f.required && <span style={{color: "red"}}> *</span>}
											</Typography>
											<TextField
												fullWidth
												placeholder={f.label.toUpperCase()}
												name={f.name}
												value={values[f.name]}
												onChange={handleChange}
												onBlur={handleBlur}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															{f.icon}
														</InputAdornment>
													),
												}}
											/>
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
					</>
				)}
			</Formik>
		</Stack>
	);
};
