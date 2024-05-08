export interface IDomicilio extends BaseEntity {
	calle: string,
    numero: number,
    cp: number,
    piso: number,
    nroDpto: number,
    localidad?: string,
    localidadId?: number
}