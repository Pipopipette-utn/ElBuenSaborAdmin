// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IPedido } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class PedidoService extends BackendClient<IPedido> {}
