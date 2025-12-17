-- =====================================================
-- BASE DE DATOS: ProyectoVeris_Clinica
-- Motor: MySQL 8.x
-- Charset recomendado por Oracle
-- =====================================================

DROP DATABASE IF EXISTS ProyectoVeris_Clinica;

CREATE DATABASE ProyectoVeris_Clinica
CHARACTER SET utf8mb4
COLLATE utf8mb4_spanish_ci;

USE ProyectoVeris_Clinica;

-- =====================================================
-- TABLA: especialidades
-- =====================================================

CREATE TABLE especialidades (
    IdEspecialidad INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion VARCHAR(50) NOT NULL,
    Dias VARCHAR(45) NOT NULL,
    Franja_HI TIME NOT NULL,
    Franja_HF TIME NOT NULL
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: medicos
-- =====================================================

CREATE TABLE medicos (
    IdMedico INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    IdEspecialidad INT NOT NULL,
    Foto VARCHAR(20) NOT NULL,
    CONSTRAINT FK_MEDICOS_ESPECIALIDADES
        FOREIGN KEY (IdEspecialidad)
        REFERENCES especialidades(IdEspecialidad)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: pacientes
-- =====================================================

CREATE TABLE pacientes (
    IdPaciente INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Cedula INT NOT NULL,
    Edad INT NOT NULL,
    Genero VARCHAR(50) NOT NULL,
    Estatura INT NOT NULL,
    Peso DOUBLE NOT NULL,
    Foto VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: administradores
-- =====================================================
-- El administrador es una entidad independiente
-- El acceso total se controla a nivel de aplicación
-- =====================================================

CREATE TABLE administradores (
    IdAdministrador INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: usuarios
-- =====================================================
-- Un usuario puede ser:
--  MEDICO  -> asociado a medicos
--  PACIENTE -> asociado a pacientes
--  ADMIN -> asociado a administradores
-- =====================================================

CREATE TABLE usuarios (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Rol ENUM('MEDICO', 'PACIENTE', 'ADMIN') NOT NULL,

    IdMedico INT NULL,
    IdPaciente INT NULL,
    IdAdministrador INT NULL,

    CONSTRAINT FK_USUARIO_MEDICO
        FOREIGN KEY (IdMedico)
        REFERENCES medicos(IdMedico)
        ON DELETE CASCADE,

    CONSTRAINT FK_USUARIO_PACIENTE
        FOREIGN KEY (IdPaciente)
        REFERENCES pacientes(IdPaciente)
        ON DELETE CASCADE,

    CONSTRAINT FK_USUARIO_ADMIN
        FOREIGN KEY (IdAdministrador)
        REFERENCES administradores(IdAdministrador)
        ON DELETE CASCADE,

    -- Regla lógica: solo una relación activa según el rol
    CONSTRAINT CK_USUARIO_RELACION
        CHECK (
            (Rol = 'MEDICO' AND IdMedico IS NOT NULL AND IdPaciente IS NULL AND IdAdministrador IS NULL)
         OR (Rol = 'PACIENTE' AND IdPaciente IS NOT NULL AND IdMedico IS NULL AND IdAdministrador IS NULL)
         OR (Rol = 'ADMIN' AND IdAdministrador IS NOT NULL AND IdMedico IS NULL AND IdPaciente IS NULL)
        )
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: medicamentos
-- =====================================================

CREATE TABLE medicamentos (
    IdMedicamento INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Tipo VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: consultas
-- =====================================================

CREATE TABLE consultas (
    IdConsulta INT AUTO_INCREMENT PRIMARY KEY,
    IdMedico INT NOT NULL,
    IdPaciente INT NOT NULL,
    FechaConsulta DATE NOT NULL,
    HI TIME NOT NULL,
    HF TIME NOT NULL,
    Diagnostico TEXT NOT NULL,
    CONSTRAINT FK_CONSULTAS_MEDICOS
        FOREIGN KEY (IdMedico)
        REFERENCES medicos(IdMedico)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT FK_CONSULTAS_PACIENTES
        FOREIGN KEY (IdPaciente)
        REFERENCES pacientes(IdPaciente)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: recetas
-- =====================================================

CREATE TABLE recetas (
    IdReceta INT AUTO_INCREMENT PRIMARY KEY,
    IdConsulta INT NOT NULL,
    IdMedicamento INT NOT NULL,
    Cantidad INT NOT NULL,
    CONSTRAINT FK_RECETAS_CONSULTAS
        FOREIGN KEY (IdConsulta)
        REFERENCES consultas(IdConsulta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT FK_RECETAS_MEDICAMENTOS
        FOREIGN KEY (IdMedicamento)
        REFERENCES medicamentos(IdMedicamento)
) ENGINE=InnoDB;
