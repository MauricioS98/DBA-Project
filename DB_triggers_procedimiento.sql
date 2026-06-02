-- Esquema de Base de Datos para Sistema de Investigación
-- Convertido desde diagrama de base de datos

-- Tabla app_user (renombrada para evitar palabra reservada "User")
CREATE TABLE app_user (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL
);

-- Tabla Project_area
CREATE TABLE Project_area (
    proyect_area_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    project_email VARCHAR NOT NULL
);

-- Tabla Teacher
CREATE TABLE Teacher (
    user_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL UNIQUE,
    team_id INTEGER,
    project_id INTEGER NOT NULL,
    teacher_email VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, teacher_id),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (project_id) REFERENCES Project_area(proyect_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Student
CREATE TABLE Student (
    user_id INTEGER NOT NULL UNIQUE,
    student_id INTEGER NOT NULL,
    team_id INTEGER,
    project_id INTEGER NOT NULL,
    student_email VARCHAR NOT NULL,
    PRIMARY KEY (user_id, student_id),
    UNIQUE (student_id),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (project_id) REFERENCES Project_area(proyect_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Cordinator
CREATE TABLE Cordinator (
    coordinator_id INTEGER NOT NULL UNIQUE,
    teacher_id INTEGER NOT NULL,
    PRIMARY KEY (coordinator_id, teacher_id),
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Investigation_area
CREATE TABLE Investigation_area (
    investigation_area_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_area_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    FOREIGN KEY (project_area_id) REFERENCES Project_area(proyect_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Investigation_team
CREATE TABLE Investigation_team (
    investigation_team_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area_id INTEGER NOT NULL,
    cordinator_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    team_email VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    FOREIGN KEY (area_id) REFERENCES Investigation_area(investigation_area_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (cordinator_id) REFERENCES Cordinator(coordinator_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Agregar claves foráneas de Teacher y Student a Investigation_team 
ALTER TABLE Teacher 
ADD FOREIGN KEY (team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE Student 
ADD FOREIGN KEY (team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Tabla Investigation_project
CREATE TABLE Investigation_project (
    investigation_project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    resume VARCHAR(2000) NOT NULL,
    state INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Product_type
CREATE TABLE Product_type (
    product_type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL
);

-- Tabla Product
CREATE TABLE Product (
    product_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    investigation_project_id INTEGER NOT NULL,
    type_product_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    document VARCHAR(255) NOT NULL,
    public_date DATE NOT NULL,
    FOREIGN KEY (investigation_project_id) REFERENCES Investigation_project(investigation_project_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (type_product_id) REFERENCES Product_type(product_type_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Product_student
CREATE TABLE Product_student (
    product_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, student_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Application
CREATE TABLE Application (
    application_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    investigation_team_id INTEGER NOT NULL,
    state VARCHAR(32) NOT NULL,
    application_date DATE NOT NULL,
    application_message VARCHAR(2000) NOT NULL,
    answer_date DATE,
    answer_message VARCHAR(2000),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (investigation_team_id) REFERENCES Investigation_team(investigation_team_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla Product_teacher
CREATE TABLE Product_teacher (
    product_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, teacher_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);



-- TRIGGERS Y TABLA DE AUDITORÍA

-- Esta sección registra automáticamente los INSERT, UPDATE y DELETE
-- realizados sobre la tabla Application.

CREATE TABLE application_audit (
    audit_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id INTEGER,
    user_id INTEGER,
    investigation_team_id INTEGER,
    old_state VARCHAR(32),
    new_state VARCHAR(32),
    old_answer_message VARCHAR(2000),
    new_answer_message VARCHAR(2000),
    operacion CHAR(1),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE OR REPLACE FUNCTION fn_audit_application()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO application_audit (application_id, user_id, investigation_team_id, new_state, new_answer_message, operacion)
        VALUES (NEW.application_id, NEW.user_id, NEW.investigation_team_id, NEW.state, NEW.answer_message, 'I');
        RETURN NEW;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO application_audit (application_id, user_id, investigation_team_id, old_state, new_state, old_answer_message, new_answer_message, operacion)
        VALUES (OLD.application_id, OLD.user_id, OLD.investigation_team_id, OLD.state, NEW.state, OLD.answer_message, NEW.answer_message, 'U');
        RETURN NEW;
        
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO application_audit (application_id, user_id, investigation_team_id, old_state, old_answer_message, operacion)
        VALUES (OLD.application_id, OLD.user_id, OLD.investigation_team_id, OLD.state, OLD.answer_message, 'D');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_audit_application
AFTER INSERT OR UPDATE OR DELETE ON Application
FOR EACH ROW EXECUTE FUNCTION fn_audit_application();



-- PROCEDIMIENTO ALMACENADO

-- Este procedimiento aprueba una solicitud de vinculación y asigna
-- el estudiante al equipo de investigación correspondiente.

CREATE OR REPLACE PROCEDURE sp_aprobar_solicitud_vinculacion(
    p_application_id INT,
    p_answer_message VARCHAR(2000)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id INT;
    v_team_id INT;
    v_current_state VARCHAR(32);
BEGIN
    -- 1. Obtener la información de la solicitud y validar su existencia
    SELECT user_id, investigation_team_id, state 
    INTO v_user_id, v_team_id, v_current_state
    FROM Application
    WHERE application_id = p_application_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Error: La solicitud con ID % no existe.', p_application_id;
    END IF;

    -- 2. Validar que la solicitud no haya sido procesada previamente
    IF v_current_state <> 'Pendiente' THEN
        RAISE EXCEPTION 'Error: La solicitud ya se encuentra en estado % y no puede ser modificada.', v_current_state;
    END IF;
    
    -- 3. Actualizar el estado de la postulación en la tabla Application
    UPDATE Application
    SET state = 'Aprobado',
        answer_date = CURRENT_DATE,
        answer_message = p_answer_message
    WHERE application_id = p_application_id;

    -- 4. Vincular al estudiante al equipo de investigación (Actualizar tabla Student)
    -- Nota: Se busca en la tabla Student usando el user_id heredado de app_user
    UPDATE Student
    SET team_id = v_team_id
    WHERE user_id = v_user_id;

    -- Si el usuario que postuló no era un Estudiante (o no se encontró en la tabla)
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Error de integridad: El usuario asociado a la solicitud no está registrado como Estudiante.';
    END IF;

    -- Si fue exitoso PostgreSQL realiza el COMMIT implícito al finalizar el bloque.
    RAISE NOTICE 'Transacción exitosa: Solicitud % aprobada y estudiante vinculado al equipo %.', p_application_id, v_team_id;

EXCEPTION
    -- En caso de cualquier error se captura, se fuerza un ROLLBACK automático y se informa
    WHEN OTHERS THEN
        RAISE NOTICE 'ROLLBACK EJECUTADO: Se detectó un error en la operación. Detalles: %', SQLERRM;
        RAISE;
END;
$$;
