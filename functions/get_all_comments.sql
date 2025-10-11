CREATE OR REPLACE FUNCTION public.get_all_comments()
RETURNS TABLE(
    id integer,
    user_name varchar,
    rating integer,
    comment_text varchar,
    photo_data text,
    photo_type varchar,
    approved boolean,
    created_at timestamp with time zone
)
LANGUAGE 'plpgsql'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    comments.id,
    comments.user_name,
    comments.rating,
    comments.comment_text,
    CASE
      WHEN comments.photo_data IS NOT NULL THEN
        'data:' || comments.photo_type || ';base64,' || encode(comments.photo_data::bytea, 'base64')
      ELSE NULL
    END AS photo_data,
    comments.photo_type,
    comments.approved,
    comments.created_at
  FROM comments;
END;
$$;

ALTER FUNCTION public.get_all_comments()
OWNER TO master_db;
