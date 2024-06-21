import { useState } from "react";

export const useMessages = () => {
	const [showSuccess, setShowSuccess] = useState("");
	const [showError, setShowError] = useState("");

	const onShowSuccess = (message: string) => setShowSuccess(message);
	const onCloseSuccess = () => setShowSuccess("");

	const onShowError = (message: string) => setShowError(message);
	const onCloseError = () => setShowError("");
	return {
		showSuccess,
		showError,
		onShowSuccess,
		onCloseSuccess,
		onShowError,
        onCloseError
	};
};
