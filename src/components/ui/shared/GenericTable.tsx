import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Stack } from "@mui/material";

// Definimos la interfaz para cada columna de la tabla
interface ITableColumn<T> {
	label: string; // Etiqueta de la columna
	key: string; // Clave que corresponde a la propiedad del objeto en los datos
	render?: (item: T) => React.ReactNode; // Función opcional para personalizar la renderización del contenido de la celda
}

export interface ITableProps<T> {
	columns: ITableColumn<T>[]; // Definición de las columnas de la tabla
	handleDelete: (id: number) => void; // Función para manejar la eliminación de un elemento
	setOpenModal: (state: boolean) => void;
}

export const TableGeneric = <T extends { id: any }>({
	columns,
	handleDelete,
	setOpenModal,
}: ITableProps<T>) => {
	
	return (
		<Stack
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Contenedor del componente Paper */}
			<Paper sx={{ width: "90%", overflow: "hidden" }}>
				{/* Contenedor de la tabla */}
				<TableContainer sx={{ maxHeight: "80vh" }}>
					{/* Tabla */}
					<Table stickyHeader aria-label="sticky table">
						{/* Encabezado de la tabla */}
						<TableHead>
							<TableRow>
								{columns.map((column, i: number) => (
									<TableCell key={i} align={"center"}>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						{/* Cuerpo de la tabla */}
						<TableBody>
							{rows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index: number) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={index}>
											{/* Celdas de la fila */}
											{columns.map((column, i: number) => {
												return (
													<TableCell key={i} align={"center"}>
														
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				{/* Paginación de la tabla */}
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Stack>
	);
};
