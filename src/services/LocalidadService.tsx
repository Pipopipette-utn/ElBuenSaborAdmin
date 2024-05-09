// Importamos el tipo de dato IEmpresa y la clase BackendClient
import { ILocalidad } from "../types/ubicacion";
import { BackendClient } from "./BakendClient";

// Clase EmpresaService que extiende BackendClient para interactuar con la API de personas
export class LocalidadService extends BackendClient<ILocalidad> {}
