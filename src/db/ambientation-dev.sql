CREATE TABLE IF NOT EXISTS comments (
  -- Primary key for unique identification, automatically generated
  id SERIAL PRIMARY KEY,

  -- User's name, limited to 50 characters, and cannot be null
  user_name VARCHAR(50) NOT NULL,

  -- A column for the user's rating, an integer from 1 to 4
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 4),

  -- The text content of the comment
  comment_text VARCHAR(250) NOT NULL,

  -- A column to store the photo's raw base64 only
  photo_data TEXT NOT NULL,

  -- Ex. image/png, image/jpeg, application/pdf}
  photo_type VARCHAR(255) NOT NULL,

  -- A boolean column to track if a comment has been approved
  approved BOOLEAN DEFAULT FALSE,

  -- Automatically records the timestamp of when the comment was created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id         SERIAL PRIMARY KEY,
  text       TEXT        NOT NULL,
  active     BOOLEAN     NOT NULL DEFAULT true,
  "order"    INT         NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE survey_responses (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE response_answers (
  id          SERIAL PRIMARY KEY,
  response_id INT  NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id INT  NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer      TEXT NOT NULL
);

INSERT INTO questions (text, "order") VALUES
  ('¿Cómo conociste nuestra comunidad?',          1),
  ('¿Qué es lo que más te atrae de nuestros eventos?', 2),
  ('¿Con qué frecuencia asistes a eventos espirituales?', 3),
  ('¿Qué temas te gustaría que abordáramos?',     4),
  ('¿Tienes algún comentario o sugerencia?',       5);

CREATE OR REPLACE FUNCTION public.get_all_comments()
  RETURNS TABLE(
    id integer,
    user_name character varying,
    rating integer,
    comment_text character varying,
    photo_data text,
    approved boolean,
    created_at timestamp with time zone)
  LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
  ROWS 1000

  AS $BODY$
  BEGIN
    RETURN QUERY
    SELECT
      c.id,
      c.user_name,
      c.rating,
      c.comment_text,
    CASE
        WHEN c.photo_data IS NOT NULL THEN
          'data:' || c.photo_type || ';base64,' || c.photo_data
        ELSE NULL
      END AS photo_data,
      c.approved,
      c.created_at
    FROM comments c
    ORDER BY c.created_at DESC;
  END;
  $BODY$;

  ALTER FUNCTION public.get_all_comments()
    OWNER TO master_db_dev;

CREATE OR REPLACE FUNCTION public.get_approved_comments()
  RETURNS TABLE(
    user_name varchar,
    rating integer,
    comment_text varchar,
    photo_data text
  )
  LANGUAGE 'plpgsql'
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      comments.user_name,
      comments.rating,
      comments.comment_text,
      CASE
        WHEN comments.photo_data IS NOT NULL THEN
          'data:' || comments.photo_type || ';base64,' || comments.photo_data
        ELSE NULL
      END AS photo_data
    FROM comments
    WHERE comments.approved = TRUE
    LIMIT 10;
  END;
  $$;

  ALTER FUNCTION public.get_approved_comments()
    OWNER TO master_db_dev;

CREATE OR REPLACE FUNCTION public.get_not_approved_comments()
  RETURNS TABLE(
    user_name varchar,
    rating integer,
    comment_text varchar,
    photo_data text
  )
  LANGUAGE 'plpgsql'
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      comments.user_name,
      comments.rating,
      comments.comment_text,
      CASE
        WHEN comments.photo_data IS NOT NULL THEN
          'data:' || comments.photo_type || ';base64,' || comments.photo_data
        ELSE NULL
      END AS photo_data
    FROM comments
    WHERE comments.approved = FALSE
    LIMIT 10;
  END;
  $$;

  ALTER FUNCTION public.get_not_approved_comments()
    OWNER TO master_db_dev;

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
  OWNER TO master_db_dev;

  CREATE OR REPLACE PROCEDURE approve_comment(p_comment_id INT)
  LANGUAGE plpgsql
  AS $$
  BEGIN
    UPDATE comments
    SET approved = TRUE
    WHERE id = p_comment_id;

    RAISE NOTICE 'Comment % approved.', p_comment_id;
  END;
  $$;
