import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { theme } from "../../../styles/theme";

export interface TableColumn {
	label: string;
	key: string;
}

export interface TableProps<T> {
	data: T[];
	columns: TableColumn[];
}

export const GenericTable = <T,>({ data, columns }: TableProps<T>) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(7);

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const [rows, setRows] = useState<T[]>([]);

	// Actualizar las filas cuando cambien los datos de la tabla
	useEffect(() => {
		setRows(data);
	}, [data]);

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Paper sx={{ width: "100%", borderRadius: "8px" }}>
				<TableContainer sx={{ maxHeight: "80vh" }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								{columns.map((column: any, i: number) => (
									<TableCell
										key={i}
										align={"center"}
										sx={{
											backgroundColor: theme.palette.bg.dark,
										}}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row: any, index: number) => {
									return (
										<TableRow
											role="checkbox"
											tabIndex={-1}
											key={index}
											sx={{
												backgroundColor: theme.palette.bg.dark,
												"&:hover": { backgroundColor: theme.palette.bg.main },
											}}
										>
											{columns.map((column: any, i: number) => {
												const cellValue = row[column.key];
												return (
													<TableCell key={i} align={"center"}>
														{column.label === "Acciones" ? (
															<Stack
																direction="row"
																spacing={2}
																justifyContent="center"
															></Stack>
														) : (
															cellValue
														)}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					sx={{ backgroundColor: theme.palette.bg.dark }}
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
};
