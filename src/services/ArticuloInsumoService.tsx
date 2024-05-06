// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IArticuloInsumo } from "../types/empresa";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class ArticuloInsumoService extends BackendClient<IArticuloInsumo> {}
