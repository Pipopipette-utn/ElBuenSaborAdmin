// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { IProvincia } from "../types/ubicacion";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class ProvinciaService extends BackendClient<IProvincia> {}
