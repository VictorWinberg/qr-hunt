--Table schemas
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id        SERIAL        NOT NULL,
  name      VARCHAR(255)  NOT NULL,
  email     VARCHAR(255)  NOT NULL UNIQUE,
  photo     VARCHAR(255)  NOT NULL,

  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS geocaches CASCADE;
CREATE TABLE geocaches (
  id        SERIAL        NOT NULL,
  qrcode    VARCHAR(36)  NOT NULL,
  title     VARCHAR(50),
  lat       DECIMAL,
  lng       DECIMAL,
  note      VARCHAR(255),
  hint      VARCHAR(255),

  ownerId   INT,

  FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS geocacheCollected CASCADE;
CREATE TABLE geocacheCollected (
  id        SERIAL        NOT NULL,
  score     INT           NOT NULL,
  comment   VARCHAR(255),

  userId     INT,
  geocacheId INT,

  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(geocacheId) REFERENCES geocaches(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);
