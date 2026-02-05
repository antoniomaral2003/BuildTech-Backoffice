-- init.sql - BuildTech Solutions Database Schema

-- =======================
-- TABLAS PRINCIPALES
-- =======================

-- Tabla: Categorías de Maquinaria
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Tipos de Maquinaria
CREATE TABLE tipos_maquinaria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nombre, categoria_id)
);

-- Tabla: Ubicaciones
CREATE TABLE ubicaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Almacén Central', 'Almacén Regional', 'Obra')),
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Maquinaria
CREATE TABLE maquinaria (
    id SERIAL PRIMARY KEY,
    codigo_interno VARCHAR(50) NOT NULL UNIQUE,
    tipo_id INTEGER NOT NULL REFERENCES tipos_maquinaria(id) ON DELETE RESTRICT,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio_fabricacion INTEGER NOT NULL CHECK (anio_fabricacion >= 1900 AND anio_fabricacion <= EXTRACT(YEAR FROM CURRENT_DATE)),
    numero_serie VARCHAR(100) NOT NULL UNIQUE,
    estado VARCHAR(50) NOT NULL DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'Asignada', 'En Mantenimiento', 'Fuera de Servicio', 'En Tránsito')),
    ubicacion_actual_id INTEGER REFERENCES ubicaciones(id) ON DELETE SET NULL,
    horas_uso INTEGER DEFAULT 0 CHECK (horas_uso >= 0),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Obras
CREATE TABLE obras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100),
    responsable_nombre VARCHAR(150),
    responsable_telefono VARCHAR(20),
    responsable_email VARCHAR(150),
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    estado VARCHAR(50) DEFAULT 'Activa' CHECK (estado IN ('Planificada', 'Activa', 'Suspendida', 'Finalizada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Operadores
CREATE TABLE operadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    documento VARCHAR(50) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(150),
    licencias TEXT, -- Tipos de máquinas que puede operar
    estado VARCHAR(50) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'De Baja')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Asignaciones a Obras
CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    obra_id INTEGER NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    maquinaria_id INTEGER NOT NULL REFERENCES maquinaria(id) ON DELETE RESTRICT,
    operador_id INTEGER REFERENCES operadores(id) ON DELETE SET NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE NOT NULL,
    fecha_entrega_real TIMESTAMP,
    fecha_devolucion_real TIMESTAMP,
    condiciones_entrega TEXT,
    observaciones TEXT,
    estado VARCHAR(50) DEFAULT 'Programada' CHECK (estado IN ('Programada', 'En Curso', 'Finalizada', 'Cancelada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (fecha_fin_estimada >= fecha_inicio)
);

-- Tabla: Mantenimientos
CREATE TABLE mantenimientos (
    id SERIAL PRIMARY KEY,
    maquinaria_id INTEGER NOT NULL REFERENCES maquinaria(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Preventivo', 'Correctivo')),
    fecha_programada DATE,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    descripcion TEXT NOT NULL,
    horas_uso_momento INTEGER,
    taller VARCHAR(150),
    costo DECIMAL(10, 2),
    observaciones TEXT,
    estado VARCHAR(50) DEFAULT 'Programado' CHECK (estado IN ('Programado', 'En Proceso', 'Completado', 'Cancelado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================
-- ÍNDICES PARA PERFORMANCE
-- =======================

CREATE INDEX idx_maquinaria_estado ON maquinaria(estado);
CREATE INDEX idx_maquinaria_tipo ON maquinaria(tipo_id);
CREATE INDEX idx_maquinaria_ubicacion ON maquinaria(ubicacion_actual_id);
CREATE INDEX idx_asignaciones_obra ON asignaciones(obra_id);
CREATE INDEX idx_asignaciones_maquinaria ON asignaciones(maquinaria_id);
CREATE INDEX idx_asignaciones_fechas ON asignaciones(fecha_inicio, fecha_fin_estimada);
CREATE INDEX idx_mantenimientos_maquinaria ON mantenimientos(maquinaria_id);
CREATE INDEX idx_mantenimientos_fecha ON mantenimientos(fecha_programada);
CREATE INDEX idx_mantenimientos_estado ON mantenimientos(estado);

-- =======================
-- DATOS DE EJEMPLO
-- =======================

-- Categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('Movimiento de Tierras', 'Maquinaria para excavación y movimiento de tierra'),
('Elevación', 'Equipos de elevación y transporte vertical'),
('Compactación', 'Maquinaria para compactar suelos'),
('Hormigonado', 'Equipos para preparación y aplicación de hormigón'),
('Transporte', 'Vehículos para transporte de materiales');

-- Tipos de Maquinaria
INSERT INTO tipos_maquinaria (nombre, categoria_id, descripcion) VALUES
('Excavadora', 1, 'Excavadora hidráulica'),
('Bulldozer', 1, 'Tractor de oruga con pala frontal'),
('Motoniveladora', 1, 'Máquina para nivelar terrenos'),
('Grúa Torre', 2, 'Grúa fija de gran altura'),
('Grúa Móvil', 2, 'Grúa autopropulsada'),
('Plataforma Elevadora', 2, 'Plataforma de trabajo en altura'),
('Rodillo', 3, 'Rodillo compactador'),
('Compactador Vibratorio', 3, 'Compactador con sistema de vibración'),
('Mezcladora', 4, 'Mezcladora de hormigón'),
('Bomba de Hormigón', 4, 'Bomba para distribución de hormigón'),
('Dumper', 5, 'Volquete pequeño'),
('Camión Articulado', 5, 'Camión volquete articulado');

-- Ubicaciones
INSERT INTO ubicaciones (nombre, tipo, direccion, ciudad, codigo_postal) VALUES
('Almacén Central Madrid', 'Almacén Central', 'Polígono Industrial Las Américas, Calle 5', 'Madrid', '28906'),
('Almacén Regional Barcelona', 'Almacén Regional', 'Zona Franca, Sector B', 'Barcelona', '08040'),
('Almacén Regional Valencia', 'Almacén Regional', 'Polígono Vara de Quart', 'Valencia', '46014');

-- Maquinaria de ejemplo
INSERT INTO maquinaria (codigo_interno, tipo_id, marca, modelo, anio_fabricacion, numero_serie, estado, ubicacion_actual_id, horas_uso) VALUES
('EXC-001', 1, 'Caterpillar', '320D', 2020, 'CAT320D2020001', 'Disponible', 1, 1250),
('EXC-002', 1, 'Komatsu', 'PC210', 2021, 'KOM210LC2021045', 'Disponible', 1, 890),
('BUL-001', 2, 'Caterpillar', 'D6T', 2019, 'CATD6T2019023', 'Asignada', 1, 2100),
('GRU-001', 4, 'Liebherr', '110 EC-B', 2022, 'LBH110ECB2022012', 'Disponible', 2, 450),
('ROD-001', 7, 'BOMAG', 'BW 211 D-5', 2020, 'BMG211D2020078', 'En Mantenimiento', 1, 1800);

-- Obras de ejemplo
INSERT INTO obras (nombre, codigo, direccion, ciudad, responsable_nombre, responsable_telefono, fecha_inicio, fecha_fin_estimada, estado) VALUES
('Residencial Las Palmeras', 'OBR-2024-001', 'Avenida de las Palmeras 45', 'Madrid', 'Carlos Fernández', '+34 666 123 456', '2024-01-15', '2025-06-30', 'Activa'),
('Centro Comercial Norte', 'OBR-2024-002', 'Carretera Nacional II, Km 23', 'Barcelona', 'Laura Martínez', '+34 677 234 567', '2024-03-01', '2025-12-31', 'Activa');

-- Operadores de ejemplo
INSERT INTO operadores (nombre, apellidos, documento, telefono, email, licencias, estado) VALUES
('Juan', 'García López', '12345678A', '+34 655 111 222', 'juan.garcia@email.com', 'Excavadoras, Bulldozers', 'Activo'),
('María', 'Rodríguez Sanz', '87654321B', '+34 666 222 333', 'maria.rodriguez@email.com', 'Grúas, Plataformas', 'Activo');

-- Asignaciones de ejemplo
INSERT INTO asignaciones (obra_id, maquinaria_id, operador_id, fecha_inicio, fecha_fin_estimada, estado) VALUES
(1, 3, 1, '2024-01-20', '2024-12-31', 'En Curso');

-- Mantenimientos de ejemplo
INSERT INTO mantenimientos (maquinaria_id, tipo, fecha_programada, descripcion, estado) VALUES
(5, 'Preventivo', '2024-02-15', 'Revisión 2000 horas - Cambio filtros y aceites', 'Programado'),
(1, 'Preventivo', '2024-03-01', 'Revisión 1500 horas', 'Programado');