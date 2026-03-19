# BuildTech Backoffice

Sistema de gestión de maquinaria pesada para empresas constructoras. Permite administrar el inventario de equipos, asignaciones a obras, mantenimientos y operadores desde una interfaz web centralizada.

![Angular](https://img.shields.io/badge/Angular-21.1-DD0031?logo=angular&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?logo=tailwindcss&logoColor=white)

---

## Índice

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Despliegue con Docker](#despliegue-con-docker)
- [Desarrollo Local](#desarrollo-local)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Reference](#api-reference)
- [Módulos del Sistema](#módulos-del-sistema)
- [Datos de Ejemplo](#datos-de-ejemplo)

---

## Descripción

BuildTech Backoffice es una aplicación full-stack de gestión de activos para el sector de la construcción. Digitaliza los procesos de control de maquinaria pesada: desde el inventario y las asignaciones a obras hasta los mantenimientos programados.

### Funcionalidades principales

- **Inventario de maquinaria** — Control total del parque de maquinaria: estado, ubicación, marca, modelo y número de serie
- **Gestión de obras** — Seguimiento de proyectos de construcción con responsables y fechas
- **Asignaciones** — Asigna maquinaria y operadores a obras, con control de entregas y devoluciones
- **Mantenimientos** — Registro de mantenimientos preventivos y correctivos con costes y talleres
- **Operadores** — Gestión del personal con sus licencias y cualificaciones
- **Categorías y ubicaciones** — Catálogos configurables para clasificar equipos y almacenes

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend Framework | Angular | 21.1.0 |
| Estilos | Tailwind CSS | 4.1.12 |
| Backend Framework | ASP.NET Core Web API | .NET 10.0 |
| ORM | Entity Framework Core | 10.0.2 |
| Base de Datos | PostgreSQL | 17-Alpine |
| Servidor Web | Nginx | Alpine |
| Containerización | Docker + Docker Compose | 3.8 |
| Testing (frontend) | Vitest | 4.0.8 |

---

## Requisitos Previos

### Para despliegue con Docker (recomendado)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución

### Para desarrollo local
- [.NET SDK 10.0](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/) y npm
- [PostgreSQL 17](https://www.postgresql.org/download/) o Docker para la base de datos

---

## Despliegue con Docker

La forma más sencilla de arrancar toda la aplicación:

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/BuildTechBackoffice.git
cd BuildTechBackoffice

# Construir y arrancar todos los servicios
docker-compose up --build
```

Tras el arranque (puede tardar unos minutos la primera vez):

| Servicio | URL |
|---------|-----|
| Frontend (Angular) | http://localhost:4200 |
| Backend API | http://localhost:5289/api |
| Swagger UI | http://localhost:5289/swagger |
| PostgreSQL | localhost:5432 |

> La base de datos se crea automáticamente mediante EF Core Migrations y se pobla con datos de ejemplo en el primer arranque. No es necesaria ninguna configuración adicional.

### Comandos útiles de Docker

```bash
# Arrancar en segundo plano
docker-compose up -d --build

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (borra la base de datos)
docker-compose down -v

# Reconstruir un servicio concreto
docker-compose up --build backend
```

---

## Desarrollo Local

### Backend (.NET)

```bash
cd buildtech-backend

# Restaurar dependencias
dotnet restore

# Configurar la cadena de conexión en appsettings.Development.json
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Port=5432;Database=buildtech_db;Username=buildtech_user;Password=buildtech_pass_2024"
# }

# Ejecutar (aplica migraciones y seed automáticamente)
dotnet run
```

El backend arranca en `http://localhost:5289` con Swagger disponible en `http://localhost:5289/swagger`.

### Frontend (Angular)

```bash
cd buildtech-frontend

# Instalar dependencias
npm install

# Servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

### Scripts disponibles (frontend)

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción |
| `npm run watch` | Build en modo watch |
| `npm test` | Ejecutar tests con Vitest |

---

## Estructura del Proyecto

```
BuildTechBackoffice/
├── buildtech-backend/              # API REST (.NET 10)
│   ├── Controllers/                # 8 controladores REST
│   ├── Data/
│   │   ├── ApplicationDbContext.cs # Contexto de EF Core
│   │   └── DbSeeder.cs             # Datos de ejemplo (seed)
│   ├── Migrations/                 # Migraciones de EF Core
│   ├── Models/
│   │   ├── DTOs/                   # Objetos de transferencia de datos
│   │   └── Entities/               # Entidades de base de datos
│   ├── Services/
│   │   ├── Interfaces/             # Interfaces de servicio
│   │   └── Implementations/        # Implementaciones
│   ├── Dockerfile
│   └── Program.cs
│
├── buildtech-frontend/             # SPA (Angular 21)
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── models/             # Interfaces TypeScript
│   │   │   ├── services/           # Servicios compartidos (loading, notifications)
│   │   │   ├── guards/             # Route guards
│   │   │   └── interceptors/       # HTTP interceptors
│   │   ├── shared/
│   │   │   ├── components/         # Componentes reutilizables (UI, layout, forms)
│   │   │   ├── pipes/              # Pipes personalizados
│   │   │   ├── directives/         # Directivas
│   │   │   └── validators/         # Validadores de formulario
│   │   └── features/               # Módulos de funcionalidad (lazy-loaded)
│   │       ├── dashboard/
│   │       ├── maquinaria/
│   │       ├── obras/
│   │       ├── asignaciones/
│   │       ├── mantenimientos/
│   │       ├── operadores/
│   │       ├── categorias/
│   │       └── ubicaciones/
│   ├── Dockerfile
│   └── nginx.conf
│
├── database/
│   └── init.sql                    # Referencia del esquema SQL
└── docker-compose.yml              # Orquestación de contenedores
```

---

## API Reference

Todos los endpoints siguen el patrón REST estándar bajo `/api/`.

| Recurso | Endpoint base | Endpoints adicionales |
|---------|--------------|----------------------|
| Maquinaria | `/api/maquinaria` | — |
| Categorías | `/api/categoria` | — |
| Tipos de Maquinaria | `/api/tipomaquinaria` | `GET /categoria/{id}` |
| Ubicaciones | `/api/ubicacion` | — |
| Obras | `/api/obra` | `GET /estado/{estado}` |
| Operadores | `/api/operador` | — |
| Asignaciones | `/api/asignacion` | `GET /activas`, `GET /maquinaria/{id}`, `GET /obra/{id}` |
| Mantenimientos | `/api/mantenimiento` | `GET /maquinaria/{id}`, `GET /proximos/{dias}` |

La documentación interactiva completa está disponible en **Swagger UI**: `http://localhost:5289/swagger`

---

## Módulos del Sistema

### Dashboard
Vista general con métricas clave: total de maquinaria, asignaciones activas, mantenimientos pendientes y obras en curso. Incluye alertas de vencimientos próximos.

### Maquinaria
Inventario completo del parque de equipos. Cada máquina registra:
- Código interno, marca, modelo, año de fabricación y número de serie
- Tipo y categoría (vinculados al catálogo)
- Ubicación actual y estado

**Estados posibles:** `Disponible` · `Asignada` · `En Mantenimiento` · `Fuera de Servicio` · `En Tránsito`

### Obras
Proyectos de construcción con datos del responsable, fechas estimadas y estado del proyecto.

**Estados posibles:** `Activa` · `En Pausa` · `Finalizada` · `Cancelada`

### Asignaciones
Vincula maquinaria, obras y operadores. Registra condiciones de entrega y devolución, con fechas reales vs. estimadas.

**Estados posibles:** `Programada` · `En Curso` · `Finalizada` · `Cancelada`

### Mantenimientos
Registro de intervenciones sobre cada máquina (preventivas o correctivas). Incluye taller, coste, horas de uso y fechas de inicio y fin.

**Estados posibles:** `Programado` · `En Proceso` · `Completado` · `Cancelado`

### Operadores
Personal autorizado a operar maquinaria, con sus licencias, datos de contacto y estado laboral.

**Estados posibles:** `Activo` · `Inactivo`

### Categorías y Ubicaciones
Catálogos configurables. Las categorías agrupan los tipos de maquinaria; las ubicaciones representan almacenes o centros logísticos.

---

## Datos de Ejemplo

Al desplegar por primera vez, el sistema inserta automáticamente datos de ejemplo para facilitar la evaluación:

| Entidad | Cantidad |
|---------|---------|
| Categorías | 5 |
| Tipos de maquinaria | 12 |
| Ubicaciones | 3 |
| Máquinas | 8 |
| Obras | 3 |
| Operadores | 5 |
| Asignaciones | 3 |
| Mantenimientos | 4 |

Los datos incluyen marcas reales (Caterpillar, Komatsu, Liebherr, BOMAG, JLG) y representan un escenario habitual de una empresa constructora con operaciones en Madrid, Barcelona y Valencia.

> El seeder es idempotente: solo inserta datos si las tablas están vacías. Los datos existentes nunca se sobreescriben.

---

## Licencia

Este proyecto es de uso privado. Todos los derechos reservados.
