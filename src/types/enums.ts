export enum Rol {
    Superadmin = 0,
    Administrador = 1,
    Cocinero = 3,
    Cajero = 4, 
    Delivery = 5
}

export enum Estado {
    Pendiente = 1,
    Preparacion = 0,
    Cancelado = 2, 
    Rechazado = 3, 
    Delivery = 4, 
    Entregado = 5,
}

const orderedEstados = [
    Estado.Pendiente,
    Estado.Preparacion,
    Estado.Cancelado,
    Estado.Rechazado,
    Estado.Delivery,
    Estado.Entregado,
];

export const estadoOptions = orderedEstados.map((estado) => ({
    key: estado,
    label: Estado[estado],
}));