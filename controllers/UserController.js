const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

module.exports = {
  signin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      res.status(200).json({ token ,name: user.name, id: user.id});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  signup: async (req, res) => {
    try {
      const { name, username, password } = req.body;

      if (!username || !password || !name) {
        return res
          .status(400)
          .json({ message: "username and password are required" });
      }

      const userExists = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: name,
          username: username,
          password: hashedPassword,
          level: "user",
        },
      });

      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
