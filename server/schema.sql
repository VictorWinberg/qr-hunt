--SQL TABLE SCHEMAS
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id         SERIAL        NOT NULL,
  name       VARCHAR(50)   NOT NULL,
  username   VARCHAR(50)   NOT NULL,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  photo      VARCHAR(255),
  locale     VARCHAR(2),
  max_streak INTEGER       NOT NULL DEFAULT 0,
  is_admin   BOOLEAN       NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS qrcodes CASCADE;
CREATE TABLE qrcodes (
  uuid       VARCHAR(36)  NOT NULL,

  owner_id   INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (uuid)
);

DROP TABLE IF EXISTS qrspots CASCADE;
CREATE TABLE qrspots (
  id        SERIAL        NOT NULL,
  title     VARCHAR(50)   NOT NULL,
  lat       DECIMAL       NOT NULL,
  lng       DECIMAL       NOT NULL,
  active    BOOLEAN       NOT NULL DEFAULT TRUE,
  missing   BOOLEAN       NOT NULL DEFAULT FALSE,
  note      VARCHAR(500),
  hint      VARCHAR(255),
  score     INT,

  qrcode    VARCHAR(36)   UNIQUE,
  owner_id  INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (qrcode) REFERENCES qrcodes(uuid) ON DELETE SET NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS qrshards CASCADE;
CREATE TABLE qrshards (
  id        SERIAL        NOT NULL,
  rating    INT,
  comment   VARCHAR(255),

  user_id   INT,
  qrspot_id INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (qrspot_id) REFERENCES qrspots(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS achievements CASCADE;
CREATE TABLE achievements (
  name        VARCHAR(36)   NOT NULL,
  title       VARCHAR(50)   NOT NULL,
  icon        VARCHAR(50),
  repeatable  VARCHAR(25),
  score       INT,

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (name)
);

DROP TABLE IF EXISTS user_achievements CASCADE;
CREATE TABLE user_achievements (
  user_id          INT,
  achievement_name VARCHAR(36),
  count            INT          NOT NULL DEFAULT 1,
  popup            BOOLEAN      NOT NULL DEFAULT FALSE,

  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, achievement_name)
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_achievements
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
