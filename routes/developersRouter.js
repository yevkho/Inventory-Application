const { Router } = require("express");
const developersController = require("../controllers/developersController");

const developersRouter = Router();

developersRouter.get(
  "/:developerId",
  developersController.showSelectedDeveloperGames
);

module.exports = developersRouter;
