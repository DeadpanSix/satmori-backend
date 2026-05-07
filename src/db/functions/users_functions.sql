DROP FUNCTION IF EXISTS public.get_user_by_email(character varying);

CREATE OR REPLACE FUNCTION public.get_user_by_email(
	p_email character varying)
    RETURNS TABLE(
      id integer,
      email character varying,
      password_hash character varying,
      role character varying,
      created_at timestamp without time zone
    )
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

  AS $BODY$
    BEGIN
      RETURN QUERY
      SELECT u.id, u.email, u.password_hash, u.role::character varying, u.created_at
      FROM users u
      WHERE u.email = p_email
      LIMIT 1;
    END;

  $BODY$;

  ALTER FUNCTION public.get_user_by_email(character varying)
    OWNER TO master_db;
