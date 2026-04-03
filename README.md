# ByG Ingenieria - Frontend Web

Plataforma web para el Sistema de Gestion de Solicitud de Materiales de ByG Ingenieria. Este portal permite a los usuarios de terreno realizar pedidos, a los bodegueros administrar el inventario y al administrador gestionar los accesos del sistema.

El proyecto esta desarrollado con Next.js (App Router) para ofrecer una interfaz rapida, reactiva y optimizada.

## Tecnologias Principales

* Framework: Next.js (React)
* Lenguaje: TypeScript
* Estilos: Tailwind CSS
* Componentes UI: Shadcn UI (Radix UI)
* Gestion del Estado: Zustand (Auth Store)
* Peticiones HTTP: Axios

## Estructura del Proyecto

* src/app: Rutas y paginas de la aplicacion (App Router). Incluye los paneles protegidos en /dashboard.
* src/components/ui: Componentes reutilizables de interfaz grafica (Botones, Tablas, Modales, Inputs).
* src/services: Funciones encargadas de la comunicacion HTTP con la API del Backend.
* src/stores: Manejo del estado global de la aplicacion (ej. sesion de usuario).
* src/types: Definicion de interfaces de TypeScript para un tipado estricto.
* src/lib: Utilidades de configuracion general y configuracion del cliente Axios.

## Requisitos Previos

* Node.js (version 18 o superior).
* Gestor de paquetes npm, yarn o pnpm.

## Configuracion y Ejecucion Local

1. Clonar el repositorio:
    git clone https://github.com/sebastiancam04/ByG-Frontend.git
    cd ByG-Frontend

2. Instalar las dependencias:
    npm install

3. Configuracion de Variables de Entorno:
    Crea un archivo .env.local en la raiz del proyecto para conectar el frontend con la API:
    NEXT_PUBLIC_API_URL=http://localhost:5000/api

4. Ejecutar el servidor de desarrollo:
    npm run dev

    La aplicacion se ejecutara en http://localhost:3000.

## Control de Accesos (RBAC)

El frontend gestiona la proteccion de rutas y visualizacion de componentes dependiendo del rol definido en el JWT del usuario:
* Solicitante: Acceso al catalogo de materiales, modulo de carrito y generacion de pedidos.
* Bodeguero: Administracion del inventario y gestion de los estados de las solicitudes.
* Administrador: Acceso total al sistema, incluyendo el panel de control de usuarios (CRUD).
