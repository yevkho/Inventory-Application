const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS game (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (225) NOT NULL,
  release DATE NOT NULL,
  rating INTEGER NOT NULL,
  stock INTEGER NOT NULL
);

INSERT INTO game (title, release, rating, stock)  
VALUES
  ('Red Dead Redemption 2', '2019-11-05', 96, 3),
  ('GTA 4', '2008-12-02', 95, 5),
  ('Baldur''s Gate 3', '2023-08-03', 96, 1);


CREATE TABLE IF NOT EXISTS genre (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (100) NOT NULL
);

INSERT INTO genre (name) 
VALUES 
('Action'),
('Adventure'),
('RPG'),
('3rd Person Shooter');


CREATE TABLE IF NOT EXISTS developer (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255) NOT NULL
);

INSERT INTO developer (name) 
VALUES 
('Blizzard'),
('Larian Studios'),
('Rockstar Games');


CREATE TABLE IF NOT EXISTS game_genre (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES game(id),
    genre_id INTEGER REFERENCES genre(id) ON DELETE CASCADE
);

INSERT INTO game_genre (game_id, genre_id) 
VALUES 
(1, 2),
(1, 4);

INSERT INTO game_genre (game_id, genre_id) 
VALUES 
(2, 1),
(2, 2);

INSERT INTO game_genre (game_id, genre_id) 
VALUES
(3, 2),
(3, 3);


CREATE TABLE IF NOT EXISTS game_developer (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES game(id),
    developer_id INTEGER REFERENCES developer(id)
);

INSERT INTO game_developer (game_id, developer_id) 
VALUES 
(1, 3);

INSERT INTO game_developer (game_id, developer_id) 
VALUES 
(2, 3);

INSERT INTO game_developer (game_id, developer_id) 
VALUES
(3, 1), 
(3, 2);

`;

async function execute() {
  console.log("seeding...");
  const client = new Client({
    connectionString:
      "postgresql://yevk:5656565656mM.@localhost:5432/top_inventory",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("client has disconnected");
}

execute();
