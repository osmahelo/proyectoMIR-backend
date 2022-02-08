const fs = require("fs");
const cloudinary = require("cloudinary");
const { updateUser, updateCollab } = require("../../controllers/users");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function uploadSingleHandler(req, res) {
  const { file, body } = req;
  try {
    const result = await cloudinary.uploader.upload(file.path);
    const user = req.user;
    const collab = req.collab;
    if (user) {
      await updateUser(user._id, { image: result.url });
      res.status(200).json({ message: "Imágen actualizada", result });
    }
    await updateCollab(collab._id, { image: result.url });
    res.status(200).json({ message: "Imágen actualizada", result });
  } catch (e) {
    res.status(500).json(e);
  } finally {
    fs.unlinkSync(file.path);
  }
}

async function uploadMultipleHandler(req, res) {
  const { files, body } = req;
  const response = [];

  for (const sigleFile of files) {
    try {
      const result = await cloudinary.uploader.upload(sigleFile.path);
      response.push(result);
    } catch (e) {
      res.status(500).json(e);
    } finally {
      fs.unlinkSync(sigleFile.path);
    }
  }
  res.status(200).json({ message: "También se conectó", response });
}

module.exports = {
  uploadSingleHandler,
  uploadMultipleHandler,
};
