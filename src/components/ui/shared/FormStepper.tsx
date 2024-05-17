import { Step, StepLabel, Stepper, Typography, styled } from "@mui/material";
import StepConnector, {
	stepConnectorClasses,
} from "@mui/material/StepConnector";
import { FC } from "react";
import { IStep } from "../../../types/business";
import { theme } from "../../../styles/theme";

interface FormStepperProps {
	steps: IStep[];
	activeStep: number;
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.main,
		},
	},
	[`& .${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.main,
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: theme.palette.bg.dark,
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const FormStepper: FC<FormStepperProps> = ({ steps, activeStep }) => {
	return (
		<>
			<Stepper activeStep={activeStep} connector={<QontoConnector />}>
				{steps.map((step, index) => (
					<Step key={index}>
						<StepLabel
							StepIconProps={{
								style: {
									color:
										activeStep > index
											? theme.palette.primary.main
											: theme.palette.info.light,
									fontSize: "32px",
								},
							}}
						>
							{activeStep === index && (
								<Typography variant="h5">{step.title}</Typography>
							)}
						</StepLabel>
					</Step>
				))}
			</Stepper>
		</>
	);
};

export default FormStepper;
