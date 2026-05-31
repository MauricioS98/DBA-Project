--
-- PostgreSQL database dump
--

\restrict i9NyCVoXJKUM7ErefNb6KD5htYqUo0YE9fu8vF4SHbzSTVBnjGOQRSxo1dF6d0e

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

-- Started on 2026-05-30 22:38:31 -05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 239 (class 1255 OID 25168)
-- Name: fn_audit_app_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_audit_app_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO app_user_audit (user_id, new_name, new_email, new_role, operacion)
        VALUES (NEW.user_id, NEW.name, NEW.email, NEW.role, 'I');
        RETURN NEW;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO app_user_audit (user_id, old_name, new_name, old_email, new_email, old_role, new_role, operacion)
        VALUES (OLD.user_id, OLD.name, NEW.name, OLD.email, NEW.email, OLD.role, NEW.role, 'U');
        RETURN NEW;
        
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO app_user_audit (user_id, old_name, old_email, old_role, operacion)
        VALUES (OLD.user_id, OLD.name, OLD.email, OLD.role, 'D');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.fn_audit_app_user() OWNER TO postgres;

--
-- TOC entry 240 (class 1255 OID 25180)
-- Name: fn_audit_investigation_team(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_audit_investigation_team() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO investigation_team_audit (investigation_team_id, new_name, new_classification, new_cordinator_id, operacion)
        VALUES (NEW.investigation_team_id, NEW.name, NEW.classification, NEW.cordinator_id, 'I');
        RETURN NEW;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO investigation_team_audit (investigation_team_id, old_name, new_name, old_classification, new_classification, old_cordinator_id, new_cordinator_id, operacion)
        VALUES (OLD.investigation_team_id, OLD.name, NEW.name, OLD.classification, NEW.classification, OLD.cordinator_id, NEW.cordinator_id, 'U');
        RETURN NEW;
        
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO investigation_team_audit (investigation_team_id, old_name, old_classification, old_cordinator_id, operacion)
        VALUES (OLD.investigation_team_id, OLD.name, OLD.classification, OLD.cordinator_id, 'D');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.fn_audit_investigation_team() OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 25182)
-- Name: fn_global_audit_trigger(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_global_audit_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO Global_audit (table_name, operation, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'I', NULL, to_jsonb(NEW));
        RETURN NEW;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO Global_audit (table_name, operation, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'U', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
        
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO Global_audit (table_name, operation, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'D', to_jsonb(OLD), NULL);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.fn_global_audit_trigger() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24964)
-- Name: app_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_user (
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(32) NOT NULL
);


ALTER TABLE public.app_user OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25159)
-- Name: app_user_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_user_audit (
    audit_id integer NOT NULL,
    user_id integer,
    old_name character varying(255),
    new_name character varying(255),
    old_email character varying(255),
    new_email character varying(255),
    old_role character varying(32),
    new_role character varying(32),
    operacion character(1),
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_bd character varying(100) DEFAULT CURRENT_USER
);


ALTER TABLE public.app_user_audit OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25158)
-- Name: app_user_audit_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.app_user_audit ALTER COLUMN audit_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.app_user_audit_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 24963)
-- Name: app_user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.app_user ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.app_user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 25126)
-- Name: application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application (
    application_id integer NOT NULL,
    user_id integer NOT NULL,
    investigation_team_id integer NOT NULL,
    state character varying(32) NOT NULL,
    application_date date NOT NULL,
    application_message character varying(2000) NOT NULL,
    answer_date date,
    answer_message character varying(2000)
);


ALTER TABLE public.application OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25125)
-- Name: application_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.application ALTER COLUMN application_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.application_application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 25018)
-- Name: cordinator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cordinator (
    coordinator_id integer NOT NULL,
    teacher_id integer NOT NULL
);


ALTER TABLE public.cordinator OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25031)
-- Name: investigation_area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investigation_area (
    investigation_area_id integer NOT NULL,
    project_area_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(1000) NOT NULL
);


ALTER TABLE public.investigation_area OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25030)
-- Name: investigation_area_investigation_area_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.investigation_area ALTER COLUMN investigation_area_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investigation_area_investigation_area_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 25072)
-- Name: investigation_project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investigation_project (
    investigation_project_id integer NOT NULL,
    team_id integer NOT NULL,
    title character varying(255) NOT NULL,
    resume character varying(2000) NOT NULL,
    state integer NOT NULL
);


ALTER TABLE public.investigation_project OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25071)
-- Name: investigation_project_investigation_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.investigation_project ALTER COLUMN investigation_project_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investigation_project_investigation_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 25044)
-- Name: investigation_team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investigation_team (
    investigation_team_id integer NOT NULL,
    area_id integer NOT NULL,
    cordinator_id integer NOT NULL,
    name character varying(255) NOT NULL,
    team_email character varying(255) NOT NULL,
    description character varying(1000) NOT NULL
);


ALTER TABLE public.investigation_team OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25171)
-- Name: investigation_team_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investigation_team_audit (
    audit_id integer NOT NULL,
    investigation_team_id integer,
    old_name character varying(255),
    new_name character varying(255),
    old_classification character varying(32),
    new_classification character varying(32),
    old_cordinator_id integer,
    new_cordinator_id integer,
    operacion character(1),
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_bd character varying(100) DEFAULT CURRENT_USER
);


ALTER TABLE public.investigation_team_audit OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25170)
-- Name: investigation_team_audit_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.investigation_team_audit ALTER COLUMN audit_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investigation_team_audit_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 25043)
-- Name: investigation_team_investigation_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.investigation_team ALTER COLUMN investigation_team_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investigation_team_investigation_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 25093)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    investigation_project_id integer NOT NULL,
    type_product_id integer NOT NULL,
    title character varying(255) NOT NULL,
    document character varying(255) NOT NULL,
    public_date date NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25092)
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product ALTER COLUMN product_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 25110)
-- Name: product_student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_student (
    product_id integer NOT NULL,
    student_id integer NOT NULL
);


ALTER TABLE public.product_student OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25143)
-- Name: product_teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_teacher (
    product_id integer NOT NULL,
    teacher_id integer NOT NULL
);


ALTER TABLE public.product_teacher OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25085)
-- Name: product_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_type (
    product_type_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(1000) NOT NULL
);


ALTER TABLE public.product_type OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25084)
-- Name: product_type_product_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_type ALTER COLUMN product_type_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_type_product_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24973)
-- Name: project_area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_area (
    proyect_area_id integer NOT NULL,
    name character varying NOT NULL,
    project_email character varying NOT NULL
);


ALTER TABLE public.project_area OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24997)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    user_id integer NOT NULL,
    student_id integer NOT NULL,
    team_id integer,
    project_id integer NOT NULL,
    student_email character varying NOT NULL
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24980)
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    user_id integer NOT NULL,
    teacher_id integer NOT NULL,
    team_id integer,
    project_id integer NOT NULL,
    teacher_email character varying(255) NOT NULL
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- TOC entry 3433 (class 2606 OID 25167)
-- Name: app_user_audit app_user_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user_audit
    ADD CONSTRAINT app_user_audit_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 3397 (class 2606 OID 24972)
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- TOC entry 3399 (class 2606 OID 24970)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3429 (class 2606 OID 25132)
-- Name: application application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_pkey PRIMARY KEY (application_id);


--
-- TOC entry 3413 (class 2606 OID 25024)
-- Name: cordinator cordinator_coordinator_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cordinator
    ADD CONSTRAINT cordinator_coordinator_id_key UNIQUE (coordinator_id);


--
-- TOC entry 3415 (class 2606 OID 25022)
-- Name: cordinator cordinator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cordinator
    ADD CONSTRAINT cordinator_pkey PRIMARY KEY (coordinator_id, teacher_id);


--
-- TOC entry 3417 (class 2606 OID 25037)
-- Name: investigation_area investigation_area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_area
    ADD CONSTRAINT investigation_area_pkey PRIMARY KEY (investigation_area_id);


--
-- TOC entry 3421 (class 2606 OID 25078)
-- Name: investigation_project investigation_project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_project
    ADD CONSTRAINT investigation_project_pkey PRIMARY KEY (investigation_project_id);


--
-- TOC entry 3435 (class 2606 OID 25179)
-- Name: investigation_team_audit investigation_team_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_team_audit
    ADD CONSTRAINT investigation_team_audit_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 3419 (class 2606 OID 25050)
-- Name: investigation_team investigation_team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT investigation_team_pkey PRIMARY KEY (investigation_team_id);


--
-- TOC entry 3425 (class 2606 OID 25099)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- TOC entry 3427 (class 2606 OID 25114)
-- Name: product_student product_student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_student
    ADD CONSTRAINT product_student_pkey PRIMARY KEY (product_id, student_id);


--
-- TOC entry 3431 (class 2606 OID 25147)
-- Name: product_teacher product_teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_teacher
    ADD CONSTRAINT product_teacher_pkey PRIMARY KEY (product_id, teacher_id);


--
-- TOC entry 3423 (class 2606 OID 25091)
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (product_type_id);


--
-- TOC entry 3401 (class 2606 OID 24979)
-- Name: project_area project_area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_area
    ADD CONSTRAINT project_area_pkey PRIMARY KEY (proyect_area_id);


--
-- TOC entry 3407 (class 2606 OID 25003)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (user_id, student_id);


--
-- TOC entry 3409 (class 2606 OID 25007)
-- Name: student student_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_student_id_key UNIQUE (student_id);


--
-- TOC entry 3411 (class 2606 OID 25005)
-- Name: student student_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_key UNIQUE (user_id);


--
-- TOC entry 3403 (class 2606 OID 24984)
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (user_id, teacher_id);


--
-- TOC entry 3405 (class 2606 OID 24986)
-- Name: teacher teacher_teacher_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_teacher_id_key UNIQUE (teacher_id);


--
-- TOC entry 3455 (class 2620 OID 25169)
-- Name: app_user trg_audit_app_user; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_app_user AFTER INSERT OR DELETE OR UPDATE ON public.app_user FOR EACH ROW EXECUTE FUNCTION public.fn_audit_app_user();


--
-- TOC entry 3461 (class 2620 OID 25190)
-- Name: application trg_audit_application; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_application AFTER INSERT OR DELETE OR UPDATE ON public.application FOR EACH ROW EXECUTE FUNCTION public.fn_global_audit_trigger();


--
-- TOC entry 3459 (class 2620 OID 25188)
-- Name: investigation_project trg_audit_investigation_project; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_investigation_project AFTER INSERT OR DELETE OR UPDATE ON public.investigation_project FOR EACH ROW EXECUTE FUNCTION public.fn_global_audit_trigger();


--
-- TOC entry 3458 (class 2620 OID 25181)
-- Name: investigation_team trg_audit_investigation_team; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_investigation_team AFTER INSERT OR DELETE OR UPDATE ON public.investigation_team FOR EACH ROW EXECUTE FUNCTION public.fn_audit_investigation_team();


--
-- TOC entry 3460 (class 2620 OID 25189)
-- Name: product trg_audit_product; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_product AFTER INSERT OR DELETE OR UPDATE ON public.product FOR EACH ROW EXECUTE FUNCTION public.fn_global_audit_trigger();


--
-- TOC entry 3457 (class 2620 OID 25186)
-- Name: student trg_audit_student; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_student AFTER INSERT OR DELETE OR UPDATE ON public.student FOR EACH ROW EXECUTE FUNCTION public.fn_global_audit_trigger();


--
-- TOC entry 3456 (class 2620 OID 25187)
-- Name: teacher trg_audit_teacher; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_audit_teacher AFTER INSERT OR DELETE OR UPDATE ON public.teacher FOR EACH ROW EXECUTE FUNCTION public.fn_global_audit_trigger();


--
-- TOC entry 3451 (class 2606 OID 25138)
-- Name: application application_investigation_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_investigation_team_id_fkey FOREIGN KEY (investigation_team_id) REFERENCES public.investigation_team(investigation_team_id);


--
-- TOC entry 3452 (class 2606 OID 25133)
-- Name: application application_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application
    ADD CONSTRAINT application_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id);


--
-- TOC entry 3442 (class 2606 OID 25025)
-- Name: cordinator cordinator_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cordinator
    ADD CONSTRAINT cordinator_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teacher(teacher_id);


--
-- TOC entry 3443 (class 2606 OID 25038)
-- Name: investigation_area investigation_area_project_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_area
    ADD CONSTRAINT investigation_area_project_area_id_fkey FOREIGN KEY (project_area_id) REFERENCES public.project_area(proyect_area_id);


--
-- TOC entry 3446 (class 2606 OID 25079)
-- Name: investigation_project investigation_project_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_project
    ADD CONSTRAINT investigation_project_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.investigation_team(investigation_team_id);


--
-- TOC entry 3444 (class 2606 OID 25051)
-- Name: investigation_team investigation_team_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT investigation_team_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.investigation_area(investigation_area_id);


--
-- TOC entry 3445 (class 2606 OID 25056)
-- Name: investigation_team investigation_team_cordinator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigation_team
    ADD CONSTRAINT investigation_team_cordinator_id_fkey FOREIGN KEY (cordinator_id) REFERENCES public.cordinator(coordinator_id);


--
-- TOC entry 3447 (class 2606 OID 25100)
-- Name: product product_investigation_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_investigation_project_id_fkey FOREIGN KEY (investigation_project_id) REFERENCES public.investigation_project(investigation_project_id);


--
-- TOC entry 3449 (class 2606 OID 25115)
-- Name: product_student product_student_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_student
    ADD CONSTRAINT product_student_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 3450 (class 2606 OID 25120)
-- Name: product_student product_student_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_student
    ADD CONSTRAINT product_student_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);


--
-- TOC entry 3453 (class 2606 OID 25148)
-- Name: product_teacher product_teacher_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_teacher
    ADD CONSTRAINT product_teacher_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 3454 (class 2606 OID 25153)
-- Name: product_teacher product_teacher_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_teacher
    ADD CONSTRAINT product_teacher_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teacher(teacher_id);


--
-- TOC entry 3448 (class 2606 OID 25105)
-- Name: product product_type_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_product_id_fkey FOREIGN KEY (type_product_id) REFERENCES public.product_type(product_type_id);


--
-- TOC entry 3439 (class 2606 OID 25013)
-- Name: student student_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project_area(proyect_area_id);


--
-- TOC entry 3440 (class 2606 OID 25066)
-- Name: student student_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.investigation_team(investigation_team_id);


--
-- TOC entry 3441 (class 2606 OID 25008)
-- Name: student student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id);


--
-- TOC entry 3436 (class 2606 OID 24992)
-- Name: teacher teacher_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project_area(proyect_area_id);


--
-- TOC entry 3437 (class 2606 OID 25061)
-- Name: teacher teacher_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.investigation_team(investigation_team_id);


--
-- TOC entry 3438 (class 2606 OID 24987)
-- Name: teacher teacher_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id);


-- Completed on 2026-05-30 22:38:31 -05

--
-- PostgreSQL database dump complete
--

\unrestrict i9NyCVoXJKUM7ErefNb6KD5htYqUo0YE9fu8vF4SHbzSTVBnjGOQRSxo1dF6d0e

