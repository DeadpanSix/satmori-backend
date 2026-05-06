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
