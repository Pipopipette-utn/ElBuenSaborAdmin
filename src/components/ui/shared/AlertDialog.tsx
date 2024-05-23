import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FC } from "react";

interface AlertDialogProps {
	open: boolean;
	title: string;
	content: string;
	agreeButtonText?: string
	onAgreeClose: (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void;
	onDisagreeClose?: (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void;
}

export const AlertDialog: FC<AlertDialogProps> = ({
	open,
	title,
	content,
	agreeButtonText,
	onAgreeClose,
	onDisagreeClose,
}) => {
	return (
		<Dialog open={open} onClose={onDisagreeClose}>
			<DialogTitle sx={{fontSize: "16px"}}>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{fontSize: "14px"}}>{content}</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ pb: 2, pr: 2 }}>
				<Button variant="outlined" onClick={onAgreeClose}>
					{agreeButtonText ?? "Sí"}
				</Button>
				{onDisagreeClose && (
					<Button variant="outlined" onClick={onDisagreeClose} autoFocus>
						No
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};
