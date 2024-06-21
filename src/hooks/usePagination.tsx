import { useState } from "react";

export const usePagination = () => {
	const [totalRows, setTotalRows] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(6);

	const onPageChange = (newPage: number) => {
		setPage(newPage);
	};

	const onRowsPerPageChange = (newRowsPerPage: number) => {
		setRowsPerPage(newRowsPerPage);
	};

	return {
		totalRows,
		page,
		rowsPerPage,
		onPageChange,
		onRowsPerPageChange,
        setTotalRows
	};
};
