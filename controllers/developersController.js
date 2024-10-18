const db = require("../db/queries");

// 1
const showSelectedDeveloperGames = async (req, res) => {
  const { developerId } = req.params;
  console.log(developerId);

  const developer = await db.getDevById(developerId);
  console.log(developer);

  const developerGames = await db.getGamesByDeveloperId(developerId);
  console.log(developerGames);

  res.render("developer.ejs", { developer, developerGames });
};

module.exports = { showSelectedDeveloperGames };
