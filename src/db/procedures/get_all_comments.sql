CREATE OR REPLACE FUNCTION get_all_comments()
RETURNS TABLE (
  id           INT,
  user_name    VARCHAR,
  rating       INT,
  comment_text VARCHAR,
  photo_data   TEXT,
  photo_type   VARCHAR,
  approved     BOOLEAN,
  created_at   TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.user_name,
    c.rating,
    c.comment_text,
    c.photo_data,
    c.photo_type,
    c.approved,
    c.created_at
  FROM comments c
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;
