const { Pool } = require("pg");

const pool = new Pool();

// 1) games
async function getAllGames() {
  const { rows } = await pool.query(`
    SELECT 
        game.id AS id,
        game.title AS title,
        game.release AS release,
        game.rating AS rating,
        game.stock AS stock,
        STRING_AGG(DISTINCT genre.name, ', ') AS genres,
        STRING_AGG(DISTINCT developer.name, ', ') AS developers
    FROM 
        game 
    LEFT JOIN 
        game_genre ON game.id = game_genre.game_id 
    LEFT JOIN 
        genre ON game_genre.genre_id = genre.id 
    JOIN 
        game_developer ON game.id = game_developer.game_id 
    JOIN 
        developer ON game_developer.developer_id = developer.id
    GROUP BY 
        game.id, game.title, game.release, game.rating, game.stock
    ORDER BY id;
  `);

  return rows;
}

async function getGameById(gameId) {
  const { rows } = await pool.query(
    `
      SELECT 
          game.id AS id,
          game.title AS title,
          game.release AS release,
          game.rating AS rating,
          game.stock AS stock,
          STRING_AGG(DISTINCT genre.name, ', ') AS genres,
          STRING_AGG(DISTINCT developer.name, ', ') AS developers
      FROM 
          game 
      LEFT JOIN 
          game_genre ON game.id = game_genre.game_id 
      LEFT JOIN 
          genre ON game_genre.genre_id = genre.id 
      JOIN 
          game_developer ON game.id = game_developer.game_id 
      JOIN 
          developer ON game_developer.developer_id = developer.id
      WHERE game.id = $1    
      GROUP BY 
          game.id, game.title, game.release, game.rating, game.stock;
    `,
    [gameId]
  );

  return rows;
}

async function addGame(title, release, rating, stock) {
  const result = await pool.query(
    "INSERT INTO game(title, release, rating, stock) VALUES ($1, $2, $3, $4) RETURNING id",
    [title, release, rating, stock]
  );

  return result.rows[0].id;
}

// 2) genres
async function getAllGenres() {
  const { rows } = await pool.query(`SELECT * FROM genre ORDER BY id;`);
  return rows;
}

async function getGenreByID(genreId) {
  const { rows } = await pool.query(
    `SELECT * FROM genre WHERE genre.id = $1;`,
    [genreId]
  );
  return rows;
}

async function addGenre(genreName) {
  await pool.query("INSERT INTO genre(name) VALUES ($1)", [genreName]);
}

async function updateGenre(genreId, genreName) {
  await pool.query("UPDATE genre SET name = ($1) WHERE id = ($2)", [
    genreName,
    genreId,
  ]);
}

async function deleteGenre(genreId) {
  await pool.query("DELETE FROM game_genre WHERE genre_id = ($1)", [genreId]);
  await pool.query("DELETE FROM genre WHERE id = ($1)", [genreId]);
}

// 3) developers
async function getAllDevs() {
  const { rows } = await pool.query(`SELECT * FROM developer ORDER BY id;`);
  return rows;
}

async function getDevById(developerId) {
  const { rows } = await pool.query(
    `SELECT * FROM developer WHERE developer.id = $1;`,
    [developerId]
  );
  return rows;
}

// 4) game_genre
async function addGameGenreRelation(newGameId, genreId) {
  await pool.query(
    "INSERT INTO game_genre(game_id, genre_id) VALUES ($1, $2)",
    [newGameId, genreId]
  );
}

// 5)

async function addGameDeveloperRelation(newGameId, developerId) {
  await pool.query(
    "INSERT INTO game_developer(game_id, developer_id) VALUES ($1, $2)",
    [newGameId, developerId]
  );
}

// 6) filters
async function getGamesByGenreId(genreId) {
  const { rows } = await pool.query(
    ` 
    SELECT 
        game.id AS id,
        game.title AS title,
        game.release AS release,
        game.rating AS rating,
        game.stock AS stock,
        STRING_AGG(DISTINCT genre.name, ', ') AS genres,
        STRING_AGG(DISTINCT developer.name, ', ') AS developers
    FROM 
        game 
    JOIN 
        game_genre ON game.id = game_genre.game_id 
    JOIN 
        genre ON game_genre.genre_id = genre.id 
    JOIN 
        game_developer ON game.id = game_developer.game_id 
    JOIN 
        developer ON game_developer.developer_id = developer.id
    WHERE game.id IN (SELECT game_id FROM game_genre WHERE genre_id = $1)    
    GROUP BY 
        game.id, game.title, game.release, game.rating, game.stock
    ORDER BY id;
`,
    [genreId]
  );

  return rows;
}

async function getGamesByDeveloperId(developerId) {
  const { rows } = await pool.query(
    `
      SELECT 
          game.id AS id,
          game.title AS title,
          game.release AS release,
          game.rating AS rating,
          game.stock AS stock,
          STRING_AGG(DISTINCT genre.name, ', ') AS genres,
          STRING_AGG(DISTINCT developer.name, ', ') AS developers
      FROM 
          game 
      JOIN 
          game_genre ON game.id = game_genre.game_id 
      JOIN 
          genre ON game_genre.genre_id = genre.id 
      JOIN 
          game_developer ON game.id = game_developer.game_id 
      JOIN 
          developer ON game_developer.developer_id = developer.id
      WHERE game.id IN (SELECT game_id FROM game_developer WHERE developer_id = $1)    
      GROUP BY 
          game.id, game.title, game.release, game.rating, game.stock
      ORDER BY id;
  `,
    [developerId]
  );

  return rows;
}

module.exports = {
  getAllGames,
  getGameById,
  addGame,
  getAllGenres,
  getGenreByID,
  addGenre,
  updateGenre,
  deleteGenre,
  getAllDevs,
  getDevById,
  addGameGenreRelation,
  addGameDeveloperRelation,
  getGamesByGenreId,
  getGamesByDeveloperId,
};

const getAllValuesQuery = `
SELECT 
    game.id, 
    game.title, 
    game.release, 
    game.rating, 
    game.stock, 
    genre.name AS genre, 
    developer.name AS developer 
FROM game 
LEFT JOIN game_genre 
    ON game.id = game_genre.game_id 
LEFT JOIN genre 
    ON game_genre.genre_id = genre.id 
JOIN game_developer 
    ON game.id = game_developer.game_id 
JOIN developer 
    ON game_developer.developer_id = developer.id;
`;

const getAllUniqueValuesQuery = `
SELECT 
    game.id AS id,
    game.title AS title,
    game.release AS release,
    game.rating AS rating,
    game.stock AS stock,
    STRING_AGG(DISTINCT genre.name, ', ') AS genres,
    STRING_AGG(DISTINCT developer.name, ', ') AS developers
FROM 
    game 
JOIN 
    game_genre ON game.id = game_genre.game_id 
JOIN 
    genre ON game_genre.genre_id = genre.id 
JOIN 
    game_developer ON game.id = game_developer.game_id 
JOIN 
    developer ON game_developer.developer_id = developer.id
GROUP BY 
    game.id, game.title, game.release, game.rating, game.stock;
`;

const getAllGenresQuery = `SELECT * FROM genre;`;

const getGameByIdQuery = `
SELECT 
    game.id AS id,
    game.title AS title,
    game.release AS release,
    game.rating AS rating,
    game.stock AS stock,
    STRING_AGG(DISTINCT genre.name, ', ') AS genres,
    STRING_AGG(DISTINCT developer.name, ', ') AS developers
FROM 
    game 
JOIN 
    game_genre ON game.id = game_genre.game_id 
JOIN 
    genre ON game_genre.genre_id = genre.id 
JOIN 
    game_developer ON game.id = game_developer.game_id 
JOIN 
    developer ON game_developer.developer_id = developer.id
WHERE game.id = 1    
GROUP BY 
    game.id, game.title, game.release, game.rating, game.stock;
`;

const getGameByGenreIdQuery = `
SELECT 
    game.id AS id,
    game.title AS title,
    game.release AS release,
    game.rating AS rating,
    game.stock AS stock,
    STRING_AGG(DISTINCT genre.name, ', ') AS genres,
    STRING_AGG(DISTINCT developer.name, ', ') AS developers
FROM 
    game 
JOIN 
    game_genre ON game.id = game_genre.game_id 
JOIN 
    genre ON game_genre.genre_id = genre.id 
JOIN 
    game_developer ON game.id = game_developer.game_id 
JOIN 
    developer ON game_developer.developer_id = developer.id
WHERE game.id IN (SELECT game_id FROM game_genre WHERE genre_id = $1)    
GROUP BY 
    game.id, game.title, game.release, game.rating, game.stock;
`;
