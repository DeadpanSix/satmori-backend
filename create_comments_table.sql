CREATE TABLE IF NOT EXISTS comments (
    -- Primary key for unique identification, automatically generated
    id SERIAL PRIMARY KEY,

    -- User's name, limited to 50 characters, and cannot be null
    user_name VARCHAR(50) NOT NULL,

    -- A column for the user's rating, an integer from 1 to 4
    rating INTEGER CHECK (rating >= 1 AND rating <= 4),

    -- The text content of the comment
    comment_text VARCHAR(50) NOT NULL,

    -- A column to store the photo's binary data (BYTEA)
    photo_data BYTEA,

    -- A boolean column to track if a comment has been approved
    approved BOOLEAN DEFAULT FALSE,

    -- Automatically records the timestamp of when the comment was created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
