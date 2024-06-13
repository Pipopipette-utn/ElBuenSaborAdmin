# El buen sabor
## Para probarlo: 
1. Clonar el repositorio:
   `git clone https://github.com/Pipopipette-utn/ElBuenSaborAdmin`
2. Abrir el proyecto y ejecutar el comando:
  `npm install`
3. Crear el archivo .env con las siguientes claves:

```
VITE_API_URL=http://localhost:8080

VITE_AUTH0_DOMAIN="dev-a05a7lseksnulwmg.us.auth0.com"

VITE_AUTH0_CLIENT_ID="UtXRb461duqH2tuBF7ZB8DRss9AwFIcx"

VITE_AUTH0_CALLBACK_URL="http://localhost:5173/callback"

VITE_AUTH0_AUDIENCE="https://elbuensabor"

VITE_API_SERVER_URL="http://localhost:8080"
```

5. Correr la aplicación Java (Backend): `https://github.com/Pipopipette-utn/entidades_BuenSabor`
6. Correr el frontend con el comando:
  `npm run dev`
7. Credenciales para loguearse:

    Rol Superadmin: Usuario superadmin@gmail.com, contraseña Elbuensabor!
   
    Rol Admin: Usuario admin@gmail.com, contraseña Elbuensabor!

    Rol Cocinero: Usuario cocinero@gmail.com, contraseña Elbuensabor!

    Rol Cajero: Usuario cajero@gmail.com, contraseña Elbuensabor!

    Rol Delivery: Usuario delivery@gmail.com, contraseña Elbuensabor!
    
12. Con el rol superadmin puedes acceder a todas las empresas, sus sucursales, y todas las acciones y pantallas relacionadas a ellas.
13. Con el rol admin puedes acceder sólo a la empresa a la que corresponde ese admin, y acceder y modificar todos los datos de todas las sucursales de esa empresa.
14. Con el rol cocinero puedes acceder sólo a la sucursal de la que es empleado, y acceder y modificar artículos, categorías, promociones y unidades de medida.
15. Con el rol cajero puedes acceder sólo a la sucursal de la que es empleado, y acceder y modificar estados de pedidos, y visualizar artículos, categorías y promociones.
16. Con el rol delivery puedes acceder sólo a la sucursal de la que es empleado, y acceder y modificar estados de pedidos sólo hacia estado "DELIVERY" o "ENTREGADO".
