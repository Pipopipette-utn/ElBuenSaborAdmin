
import styles from "./Users.module.css";
import { Button } from "@mui/material";

export const Users = () => {
  const headerData = [
    {
      label: "Nombre",
    },
    {
      label: "Apellido",
    },
    {
      label: "Mail",
    },
    {
      label: "Categoria",
    },
  ];

  const bodyData = [
    {
      nombre: "Juan",
      apellido: "González",
      email: "juan@example.com",
      categoria: "Bronce",
    },
    {
      nombre: "María",
      apellido: "Martínez",
      email: "maria@example.com",
      categoria: "Plata",
    },
    {
      nombre: "Pedro",
      apellido: "Rodríguez",
      email: "pedro@example.com",
      categoria: "Oro",
    },
    {
      nombre: "Laura",
      apellido: "López",
      email: "laura@example.com",
      categoria: "Bronce",
    },
    {
      nombre: "Carlos",
      apellido: "Hernández",
      email: "carlos@example.com",
      categoria: "Oro",
    },
    {
      nombre: "Ana",
      apellido: "Pérez",
      email: "ana@example.com",
      categoria: "Plata",
    },
    {
      nombre: "Sofía",
      apellido: "García",
      email: "sofia@example.com",
      categoria: "Bronce",
    },
    {
      nombre: "Diego",
      apellido: "Díaz",
      email: "diego@example.com",
      categoria: "Plata",
    },
    {
      nombre: "Elena",
      apellido: "Ruiz",
      email: "elena@example.com",
      categoria: "Oro",
    },
    {
      nombre: "Miguel",
      apellido: "Sánchez",
      email: "miguel@example.com",
      categoria: "Bronce",
    },
  ];

  return (
    <div>
      <div>
        <div className="d-flex gap-2 p-3">
          <Button className={styles.buttons}>
            <span className="material-symbols-outlined">search</span>
          </Button>
          <Button  className={styles.buttons}>
            <span className="material-symbols-outlined">add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
