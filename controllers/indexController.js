const db = require("../db/queries");

// 1 indexRouter
const showAllContent = async (req, res) => {
  const games = await db.getAllGames();
  console.log(games);
  const genres = await db.getAllGenres();
  console.log(genres);
  const developers = await db.getAllDevs();
  console.log(developers);

  res.render("index.ejs", { games, genres, developers });
};

module.exports = { showAllContent };
