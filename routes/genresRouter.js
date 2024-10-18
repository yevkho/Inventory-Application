const { Router } = require("express");
const genresController = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/create", genresController.createNewGenreGet);
genresRouter.post("/create", genresController.createNewGenrePost);

genresRouter.get("/:genreId", genresController.showSelectedGenreGames);

genresRouter.get("/:genreId/update", genresController.updateGenreGet);
genresRouter.post("/:genreId/update", genresController.updateGenrePost);

genresRouter.post("/:genreId/delete", genresController.deleteGenrePost);

module.exports = genresRouter;
