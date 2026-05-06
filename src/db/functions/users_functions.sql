DROP FUNCTION get_user_by_email(VARCHAR);

CREATE OR REPLACE FUNCTION get_user_by_email(p_email VARCHAR)
  RETURNS TABLE (
    id            INT,
    email         VARCHAR,
    password_hash VARCHAR,
    role          text,
    created_at    TIMESTAMP WITH TIME ZONE
  ) AS $$
  BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.password_hash, u.role::text, u.created_at
    FROM users u
    WHERE u.email = p_email
    LIMIT 1;
  END;
  $$ LANGUAGE plpgsql;

  ALTER FUNCTION get_user_by_email(VARCHAR)
    OWNER TO master_db;
