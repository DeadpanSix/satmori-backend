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
