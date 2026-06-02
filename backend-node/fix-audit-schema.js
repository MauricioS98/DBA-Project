const pool = require('./config/database');

const FIX_SQL = `
CREATE TABLE IF NOT EXISTS public.global_audit (
  audit_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  table_name character varying(255) NOT NULL,
  operation character(1) NOT NULL,
  old_data jsonb,
  new_data jsonb,
  fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  usuario_bd character varying(100) DEFAULT CURRENT_USER,
  CONSTRAINT global_audit_pkey PRIMARY KEY (audit_id)
);

CREATE OR REPLACE FUNCTION public.fn_audit_investigation_team() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO investigation_team_audit (investigation_team_id, new_name, new_classification, new_cordinator_id, operacion)
    VALUES (NEW.investigation_team_id, NEW.name, NULL, NEW.cordinator_id, 'I');
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO investigation_team_audit (investigation_team_id, old_name, new_name, old_classification, new_classification, old_cordinator_id, new_cordinator_id, operacion)
    VALUES (OLD.investigation_team_id, OLD.name, NEW.name, NULL, NULL, OLD.cordinator_id, NEW.cordinator_id, 'U');
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO investigation_team_audit (investigation_team_id, old_name, old_classification, old_cordinator_id, operacion)
    VALUES (OLD.investigation_team_id, OLD.name, NULL, OLD.cordinator_id, 'D');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
`;

async function fix() {
  const client = await pool.connect();
  try {
    await client.query(FIX_SQL);
    console.log('Esquema de auditoría corregido.');
  } finally {
    client.release();
    await pool.end();
  }
}

fix().catch((error) => {
  console.error('Error al corregir esquema:', error);
  process.exit(1);
});
