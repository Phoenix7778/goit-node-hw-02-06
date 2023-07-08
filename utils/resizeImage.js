const Jimp = require("jimp");

const resizeImage = async (path) => {
  const image = await Jimp.read(path);
  return image.resize(250, 250).writeAsync(path);
};

module.exports = resizeImage;
