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

  owner_id   INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE SET NULL,
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

  qrcode     VARCHAR(36)  UNIQUE,
  assigner_id INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY(qrcode) REFERENCES qrcodes(uuid) ON DELETE SET NULL,
  FOREIGN KEY(assigner_id) REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS geocaches_collected CASCADE;
CREATE TABLE geocaches_collected (
  id        SERIAL        NOT NULL,
  score     INT           NOT NULL,
  comment   VARCHAR(255),

  user_id     INT,
  geocache_id INT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(geocache_id) REFERENCES geocaches(id) ON DELETE SET NULL,
  UNIQUE (user_id, geocache_id),
  PRIMARY KEY(id)
);
