import { styled } from "@mui/material";
import Typography from "@mui/material/Typography"

export const ReportTitle = styled(Typography)(() => ({
    fontSize: "20px",
}));

export const ReportSubtitle = styled(Typography)(({theme}) => ({
    fontSize: "16px",
    color: theme.palette.info.light,
}));

export const ReportAmount = styled(Typography)(({theme}) => ({
	color: theme.palette.primary.main,
    fontSize: "26px",
    fontWeight: "bold",
}));