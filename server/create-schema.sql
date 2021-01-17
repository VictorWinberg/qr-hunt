--Table schemas
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id        SERIAL        NOT NULL,
  name      VARCHAR(255)  NOT NULL,
  email     VARCHAR(255)  NOT NULL UNIQUE,
  photo     VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW(),

  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS qrcodes CASCADE;
CREATE TABLE qrcodes (
  uuid      VARCHAR(36)  NOT NULL,

  ownerId   INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (uuid)
);

DROP TABLE IF EXISTS geocaches CASCADE;
CREATE TABLE geocaches (
  id        SERIAL        NOT NULL,
  title     VARCHAR(50)   NOT NULL,
  lat       DECIMAL       NOT NULL,
  lng       DECIMAL       NOT NULL,
  note      VARCHAR(255),
  hint      VARCHAR(255),

  qrcode     VARCHAR(36),
  assignerId INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY(qrcode) REFERENCES qrcodes(uuid) ON DELETE SET NULL,
  FOREIGN KEY(assignerId) REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS geocaches_collected CASCADE;
CREATE TABLE geocaches_collected (
  id        SERIAL        NOT NULL,
  score     INT           NOT NULL,
  comment   VARCHAR(255),

  userId     INT,
  geocacheId INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(geocacheId) REFERENCES geocaches(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);
