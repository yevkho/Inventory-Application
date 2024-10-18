const db = require("../db/queries");

// 1 READ
const showSelectedGame = async (req, res) => {
  const { gameId } = req.params;
  console.log(gameId);

  const rawGame = await db.getGameById(gameId);
  const game = rawGame[0];
  console.log(game);

  res.render("game.ejs", { game });
};

// 2 CREATE
const createNewGameGet = async (req, res) => {
  // const genres = await db.getAllGenres();
  // const developers = await db.getAllDevs();
  const [genres, developers] = await Promise.all([
    db.getAllGenres(),
    db.getAllDevs(),
  ]);

  res.render("createGameForm.ejs", { genres, developers });
};

const createNewGamePost = async (req, res) => {
  console.log(req.body);

  // extract values
  const { title, release, rating, stock, genre, developer } = req.body;

  // add game
  const newGameId = await db.addGame(title, release, rating, stock);
  console.log(newGameId);

  // add game_genre relationship
  if (Array.isArray(genre)) {
    for (const genreId of genre) {
      await db.addGameGenreRelation(newGameId, genreId);
    }
  } else {
    await db.addGameGenreRelation(newGameId, genre);
  }

  // add game_developer relationship
  if (Array.isArray(developer)) {
    for (const developerId of developer) {
      await db.addGameDeveloperRelation(newGameId, developerId);
    }
  } else {
    await db.addGameDeveloperRelation(newGameId, developer);
  }

  res.redirect("/");
};

module.exports = { showSelectedGame, createNewGameGet, createNewGamePost };
