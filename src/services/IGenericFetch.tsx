// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export interface IGenericFetch<T> {
	getAll(token?: string): Promise<T[]>;
	getById(id: number, token?: string): Promise<T | null>;
	create(data: T, token?: string): Promise<T>;
	update(id: number, data: T, token?: string): Promise<T>;
	// Método abstracto para eliminar un elemento por su ID
	delete(id: number, token?: string): Promise<void>;
}
