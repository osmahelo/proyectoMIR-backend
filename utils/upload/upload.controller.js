const fs = require('fs');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'lauracanon',
  api_key: '551197349596579',
  api_secret: 'G346jnn5TvaxiOtDV6eavs3wMg0',
});

async function uploadSingleHandler(req, res) {
  const { file, body } = req;
  try {
    const result = await cloudinary.uploader.upload(file.path);
    res.status(200).json({ message: 'se conecto a la ruta', result });
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
  res.status(200).json({ message: 'También se conectó', response });
}

module.exports = {
  uploadSingleHandler,
  uploadMultipleHandler
}