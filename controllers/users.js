const User = require("../models/users");
const Collaborator = require("../models/collaborator");
const HttpError = require("../utils/error");

//Creación de usuario
const userRegister = async (req, res, next) => {
  try {
    await User.create({ ...req.body });
    res.status(200).json(req.body);
  } catch (error) {
    next(new HttpError("Something went wrong", 500));
  }
};
//Creación de colaborador
const collaboratorRegister = async (req, res, next) => {
  try {
    const collaborator = await Collaborator.create({ ...req.body });
    res.status(200).json(req.body);
  } catch (error) {
    next(new HttpError("Something went wrong", 500));
  }
};

const sessionLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new HttpError("Invalid credentials", 500));
  }
  try {
    const user = await User.findOne({ email });
    const collaborator = await Collaborator.findOne({ email });
    if (user || collaborator) {
      if (user) {
        const passwordCorrect = await user.comparePassword(password);
        if (user && passwordCorrect) {
          res.status(200).json({ user });
        } else {
          next(new HttpError("Invalid credentials"), 500);
        }
      }
      if (collaborator) {
        const passwordCorrect = await collaborator.comparePassword(password);
        if (!collaborator && passwordCorrect) {
          res.status(200).json({ collaborator });
        } else {
          next(new HttpError("Invalid credentials"), 500);
        }
      }
    }
  } catch (error) {
    next(new HttpError("Invalid credentials"), 500);
  }
};

module.exports = { userRegister, collaboratorRegister, sessionLogin };
