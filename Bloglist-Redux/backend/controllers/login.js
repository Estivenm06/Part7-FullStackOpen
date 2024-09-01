const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username: username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(400).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    name: user.name,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(201).send({
    token: token,
    username: user.username,
    name: user.name,
    id: user._id,
  });
});

module.exports = loginRouter;
