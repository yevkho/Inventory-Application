const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

// 1 READ
const showSelectedGenreGames = async (req, res) => {
  const { genreId } = req.params;

  const genre = await db.getGenreByID(genreId);

  const genreGames = await db.getGamesByGenreId(genreId);

  res.render("genre.ejs", { genre, genreGames });
};

// 2 CREATE
const createNewGenreGet = (req, res) => {
  res.render("createGenreForm.ejs");
};

const validateGenre = [
  body("genreName")
    .trim()
    .notEmpty()
    .withMessage("Genre can not be empty.")
    .isLength({ max: 50 })
    .withMessage("Genre cannot be more than 50 characters long"),
];

const createNewGenrePost = [
  validateGenre,
  async (req, res) => {
    const { genreName } = req.body;
    console.log(genreName);
    // validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createGenreForm", {
        genre,
        errors: errors.array(),
      });
    }

    // validation success
    await db.addGenre(genreName);
    res.redirect("/");
  },
];

// password middleware

// 3 UPDATE
const updateGenreGet = async (req, res) => {
  const { genreId } = req.params;
  console.log(genreId);
  const rawGenre = await db.getGenreByID(genreId);
  console.log(rawGenre);
  genre = rawGenre[0];

  res.render("updateGenreForm.ejs", { genre });
};

const updateGenrePost = [
  validateGenre,
  async (req, res) => {
    const { genreId } = req.params;
    const { genreName } = req.body;
    console.log(genreId);
    console.log(genreName);
    // validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const genre = { name: genreName, id: genreId };
      return res.status(400).render("updateGenreForm", {
        genre,
        errors: errors.array(),
      });
    }

    // validation success
    await db.updateGenre(genreId, genreName);
    res.redirect("/");
  },
];

// 4 DELETE

const deleteGenrePost = async (req, res) => {
  const { genreId } = req.params;
  console.log(genreId);

  await db.deleteGenre(genreId);
  res.redirect("/");
};

module.exports = {
  showSelectedGenreGames,
  createNewGenreGet,
  createNewGenrePost,
  updateGenreGet,
  updateGenrePost,
  deleteGenrePost,
};
