import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { theme } from "../../../styles/theme";
import ButtonGroup from "./GenericTableButtonGroup";
import { Typography } from "@mui/material";

export interface TableColumn {
	label: string;
	key: string;
}

export interface TableProps<T> {
	data: T[];
	columns: TableColumn[];
	totalRows: number; // Add totalRows property
	page: number; // Add page property
	rowsPerPage: number; // Add rowsPerPage property
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onAlta: (id: number) => void;
	onSeeDetails?: (id: number) => void;
	onPageChange: (page: number) => void; // Add onPageChange handler
	onRowsPerPageChange: (rowsPerPage: number) => void; // Add onRowsPerPageChange handler
}

export const GenericTable = <T,>({
	data,
	columns,
	totalRows,
	page,
	rowsPerPage,
	onEdit,
	onDelete,
	onAlta,
	onSeeDetails,
	onPageChange,
	onRowsPerPageChange,
}: TableProps<T>) => {
	const handleChangePage = (_: unknown, newPage: number) => {
		onPageChange(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		onRowsPerPageChange(+event.target.value);
	};

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				paddingRight: 8,
			}}
		>
			<Paper
				sx={{
					width: "100%",
					borderRadius: "8px",
					backgroundColor: theme.palette.bg.dark,
				}}
			>
				<TableContainer sx={{ maxHeight: 300 }}>
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
							{data.map((row: any, index: number) => (
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
											<TableCell
												key={i}
												align={"center"}
												sx={{
													backgroundColor: row["baja"]
														? theme.palette.info.light
														: theme.palette.bg.dark,
												}}
											>
												{column.label === "Acciones" ? (
													<ButtonGroup
														idEntity={row["id"]}
														onEdit={row["baja"] ? undefined : onEdit}
														onDelete={row["baja"] ? undefined : onDelete}
														onAlta={row["baja"] ? onAlta : undefined}
														onSeeDetails={onSeeDetails!}
													/>
												) : (
													cellValue
												)}
											</TableCell>
										);
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				{data.length === 0 && (
					<Typography sx={{pl: 4}}>No hay nada para mostrar aquí</Typography>
				)}
				<TablePagination
					sx={{ backgroundColor: theme.palette.bg.dark }}
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={totalRows}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
};
