const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

class AuthenticationController {
  async signIn(req, res) {
    const { username, password } = req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (!existingUser)
        return res.status(404).json({ message: "User doesn't exist." });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        "test",
        { expiresIn: "1h" }
      );

      return res.status(200).json({ existingUser, token });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Something went wrong, try again." });
    }
  }

  async signUp(req, res) {
    const { username, password, confirmPassword } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exist." });
      if (password !== confirmPassword)
        return res.status(400).json({ message: "Password doesn't match!" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await User.create({
        username,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { username: result.username, id: result._id },
        "test",
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ result, token });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Something went wrong, try again." });
    }
  }
}

const AuthController = new AuthenticationController();

module.exports = AuthController;
