-- ==================================================
-- ENUMERACIONES
-- ==================================================
CREATE TYPE tipo_documento AS ENUM ('DNI', 'PASAPORTE');
CREATE TYPE rol AS ENUM ('ADMINISTRADOR', 'CLIENTE');
CREATE TYPE tipo_accion AS ENUM ('ELIMINAR', 'ACTUALIZAR', 'CREAR', 'LEER');
CREATE TYPE tipo_nivel AS ENUM ('SILVER', 'GOLD', 'BLACK', 'CLASICO');
CREATE TYPE tipo_membresia AS ENUM ('SILVER', 'GOLD', 'BLACK', 'CLASICO');
CREATE TYPE tipo_beneficio AS ENUM ('DESCUENTO', 'BONUS_PUNTOS', 'ACCESO_PREVENTA');
CREATE TYPE estado_membresia_cliente AS ENUM ('ACTIVA', 'VENCIDA', 'SUSPENDIDA');
CREATE TYPE EstadoPago AS ENUM ('PENDIENTE','APROBADO','CANCELADO','ANULADO');
CREATE TYPE EstadoPuntos AS ENUM ('ACTIVO','VENCIDO','CANJEADO');
CREATE TYPE TipoEstadoTiket AS ENUM ('DISPONIBLE','RESERVADA','VENDIDA','TRANSFERIDA','ANULADA');
CREATE TYPE TipoEvento AS ENUM ('ROCK','POP','ELECTRONICA','URBANO','METAL');
CREATE TYPE EstadoEvento AS ENUM ('BORRADOR','PUBLICADO','CANCELADO','AGOTADO','FINALIZADO');
CREATE TYPE EstadoCompra AS ENUM ('APROBADO','RECHAZADO','PENDIENTE');

-- ==================================================
-- TABLAS GEOGRÁFICAS
-- ==================================================
CREATE TABLE departamento (
    id_departamento SERIAL PRIMARY KEY,
    nombre varchar(100),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE provincia (
    id_provincia SERIAL PRIMARY KEY,
    nombre varchar(100),
    idDepartamento int not null,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_provincia FOREIGN KEY (idDepartamento)
        REFERENCES departamento(id_departamento) ON DELETE CASCADE
);

CREATE TABLE distrito (
    id_distrito SERIAL PRIMARY KEY,
    nombre varchar(100),
    idProvincia int not null,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_distrito FOREIGN KEY (idProvincia)
        REFERENCES provincia(id_provincia) ON DELETE CASCADE
);

-- ==================================================
-- TABLA PERSONA
-- ==================================================
CREATE TABLE persona (
    id_persona SERIAL PRIMARY KEY,
    tipo_documento tipo_documento NOT NULL,
    doc_identidad VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    fecha_nacimiento DATE,
    direccion VARCHAR(200),
    contrasenia VARCHAR(200) NOT NULL,
    rol rol NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    usuario_creacion INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_actualizacion INT,
    fecha_actualizacion TIMESTAMP,
    idDistrito INT,
    CONSTRAINT fk_dist_persona FOREIGN KEY (idDistrito) REFERENCES distrito(id_distrito)
);

-- ==================================================
-- TABLA ADMINISTRADOR (hereda persona)
-- ==================================================
CREATE TABLE administrador (
    id_admin INT PRIMARY KEY,
    cargo VARCHAR(100),
    CONSTRAINT fk_admin_persona FOREIGN KEY (id_admin)
        REFERENCES persona(id_persona) ON DELETE CASCADE
);

-- ==================================================
-- TABLA CLIENTE (hereda persona)
-- ==================================================
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY,
    nivel tipo_nivel DEFAULT 'CLASICO',
    puntos_acumulados INT DEFAULT 0,
    CONSTRAINT fk_cliente_persona FOREIGN KEY (id_cliente)
        REFERENCES persona(id_persona) ON DELETE CASCADE
);

-- ==================================================
-- LOGS Y AUDITORÍA
-- ==================================================
CREATE TABLE error_log (
    id_error SERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    severidad VARCHAR(50),
    modulo VARCHAR(100),
    mensaje_breve VARCHAR(255),
    detalle_tecnico TEXT,
    traza TEXT,
    id_admin INT,
    CONSTRAINT fk_error_admin FOREIGN KEY (id_admin)
        REFERENCES administrador(id_admin) ON DELETE SET NULL
);

CREATE TABLE auditoria_admin (
    id_auditoria SERIAL PRIMARY KEY,
    accion tipo_accion NOT NULL,
    usuario INT NOT NULL,
    modulo VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(50),
    descripcion TEXT,
    navegador VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    sistema_operativo VARCHAR(100),
    CONSTRAINT fk_auditoria_admin FOREIGN KEY (usuario)
        REFERENCES administrador(id_admin) ON DELETE CASCADE
);

-- ==================================================
-- TABLAS DE MEMBRESÍAS Y BENEFICIOS
-- ==================================================
CREATE TABLE membresia (
    id_membresia SERIAL PRIMARY KEY,
    tipo tipo_membresia NOT NULL,
    min_entradas INT NOT NULL,
    max_entradas INT,
    activo BOOLEAN DEFAULT TRUE,
    descripcion TEXT
);

CREATE TABLE beneficio (
    id_beneficio SERIAL PRIMARY KEY,
    tipo tipo_beneficio NOT NULL,
    descripcion TEXT,
    porcentaje DOUBLE PRECISION CHECK (porcentaje >= 0 AND porcentaje <= 100),
    activo BOOLEAN DEFAULT TRUE,
    id_membresia INT NOT NULL,
    CONSTRAINT fk_beneficio_membresia FOREIGN KEY (id_membresia)
        REFERENCES membresia(id_membresia) ON DELETE CASCADE
);

CREATE TABLE cliente_membresia (
    id_cliente_membresia SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_membresia INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado estado_membresia_cliente NOT NULL DEFAULT 'ACTIVA',
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_cliente_membresia_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_cliente_membresia_membresia FOREIGN KEY (id_membresia)
        REFERENCES membresia(id_membresia) ON DELETE CASCADE
);

-- ==================================================
-- TABLA PAGO Y COMPROBANTE
-- ==================================================
CREATE TABLE Pago (
    idPago SERIAL PRIMARY KEY,
    metodo VARCHAR(255),
    monto DOUBLE PRECISION,
    estado EstadoPago,
    fecha_pago DATE,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE
);

CREATE TABLE ComprobantePago (
    idComprobante SERIAL PRIMARY KEY,
    numero_serie VARCHAR(255),
    fecha_emision DATE,
    total DOUBLE PRECISION,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE,
    dni VARCHAR(255),
    idPago INT UNIQUE,
    CONSTRAINT fk_pago FOREIGN KEY (idPago) REFERENCES Pago(idPago)
);

CREATE TABLE Boleta (
    idBoleta SERIAL PRIMARY KEY,
    dni VARCHAR(255),
    nombreCliente VARCHAR(255),
    idComprobante INT,
    CONSTRAINT fk_comprobante FOREIGN KEY (idComprobante) REFERENCES ComprobantePago(idComprobante)
);

-- ==================================================
-- TABLAS DE PUNTOS Y CANJES
-- ==================================================
CREATE TABLE ReglaPuntos (
    idRegla SERIAL PRIMARY KEY,
    solesPorPunto DOUBLE PRECISION,
    puntosPorBloque INT,
    descuentoPorBloque DOUBLE PRECISION,
    activo BOOLEAN,
    estado VARCHAR(255),
    fechaInicioVigencia DATE,
    diasVigencia INT
);

CREATE TABLE Canje (
    idCanje SERIAL PRIMARY KEY,
    fechaCanje DATE,
    puntosSolicitados INT,
    puntosConsumidos INT,
    activo BOOLEAN,
    idReglapuntos INT,
    CONSTRAINT fk_id_regla_puntos FOREIGN KEY (idReglapuntos) REFERENCES ReglaPuntos(idRegla)
);

CREATE TABLE Puntos (
    idPuntos SERIAL PRIMARY KEY,
    puntosIniciales INT,
    ganadoEn DATE,
    fecha_vencimiento DATE,
    estado EstadoPuntos,
    activo BOOLEAN,
    idRegla INT,
    CONSTRAINT fk_regla_puntos FOREIGN KEY (idRegla) REFERENCES ReglaPuntos(idRegla)
);

CREATE TABLE CanjeDetalle (
    idPuntos INT,
    idCanje INT,
    puntosUsados INT,
    PRIMARY KEY (idPuntos, idCanje),
    CONSTRAINT fk_puntos FOREIGN KEY (idPuntos) REFERENCES Puntos(idPuntos),
    CONSTRAINT fk_canje FOREIGN KEY (idCanje) REFERENCES Canje(idCanje)
);

-- ==================================================
-- TABLAS EVENTOS Y LOCALES
-- ==================================================
CREATE TABLE Zona (
    idCategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    aforoMax INT,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE
);

CREATE TABLE Local (
    idLocal SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    direccion VARCHAR(255),
    aforoTotal INT,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE,
    departamento VARCHAR(255),
    codigoPostal INT,
    idCategoria INT,
    idDistrito INT,
    CONSTRAINT fk_zona FOREIGN KEY (idCategoria) REFERENCES Zona(idCategoria),
    CONSTRAINT fk_dist_local FOREIGN KEY (idDistrito) REFERENCES distrito(id_distrito)
);

CREATE TABLE Evento (
    idEvento SERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    descripcion VARCHAR(255),
    fecha DATE,
    hora TIME,
    estado EstadoEvento,
    url_imagen BYTEA,
    tipo TipoEvento,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE,
    idLocal INT,
    CONSTRAINT fk_local FOREIGN KEY (idLocal) REFERENCES Local(idLocal)
);

CREATE TABLE Ticket (
    idTicket SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    codigoQR BYTEA,
    precio DOUBLE PRECISION,
    stock INT,
    estado TipoEstadoTiket,
    activo BOOLEAN,
    idEvento INT,
    CONSTRAINT fk_evento FOREIGN KEY (idEvento) REFERENCES Evento(idEvento)
);

-- ==================================================
-- TABLAS DE COMPRAS
-- ==================================================
CREATE TABLE CarroCompras (
    idCarroCompra SERIAL PRIMARY KEY,
    tiempoMaxEspera TIMESTAMP,
    total DOUBLE PRECISION,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE
);

CREATE TABLE OrdenCompra (
    idOrdenCompra SERIAL PRIMARY KEY,
    comprobante VARCHAR(255),
    fechaOrden DATE,
    descuentoPorPuntos DOUBLE PRECISION,
    descuentoPorMembresia DOUBLE PRECISION,
    total DOUBLE PRECISION,
    estado EstadoCompra,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE,
    CONSTRAINT fk_carro_compras FOREIGN KEY (idOrdenCompra) REFERENCES CarroCompras(idCarroCompra)
);

CREATE TABLE ItemCarrito (
    idItemCarrito SERIAL PRIMARY KEY,
    cantidad INT,
    precioUnitario DOUBLE PRECISION,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE,
    idCarroCompra INT,
    CONSTRAINT fk_carro_compras_item FOREIGN KEY (idCarroCompra) REFERENCES CarroCompras(idCarroCompra)
);

CREATE TABLE OrderItems (
    idOrderItem SERIAL PRIMARY KEY,
    cantidad INT,
    precioUnitario DOUBLE PRECISION,
    activo BOOLEAN,
    usuario_creacion INT,
    fecha_creacion DATE,
    usuario_actualizacion INT,
    fecha_actualizacion DATE,
    idOrdenCompra INT,
    CONSTRAINT fk_orden_compra FOREIGN KEY (idOrdenCompra) REFERENCES OrdenCompra(idOrdenCompra)
);
