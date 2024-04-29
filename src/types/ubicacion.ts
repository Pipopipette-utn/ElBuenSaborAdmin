export interface Domicilio extends BaseEntity{
    nombre: string,
    numero: number,
    cp: number,
    piso: number,
    nroDpto: number,
    localidad: Localidad,
}

export interface Localidad extends BaseEntity{
    nombre: string,
    provincia: Provincia,
}

export interface Provincia extends BaseEntity{
    nombre: string,
    pais: Pais,
}

export interface Pais extends BaseEntity{
    nombre: string,
}