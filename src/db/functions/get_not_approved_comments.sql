DROP FUNCTION IF EXISTS public.get_not_approved_comments();

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
    OWNER TO master_db;
