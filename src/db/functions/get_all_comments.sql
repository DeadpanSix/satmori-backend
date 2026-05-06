-- FUNCTION: public.get_all_comments()

-- DROP FUNCTION IF EXISTS public.get_all_comments();

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
    OWNER TO master_db;
