const { Router } = require("express");
const gamesController = require("../controllers/gamesController");

const gamesRouter = Router();

gamesRouter.get("/create", gamesController.createNewGameGet);
gamesRouter.post("/create", gamesController.createNewGamePost);

gamesRouter.get("/:gameId", gamesController.showSelectedGame);

module.exports = gamesRouter;
