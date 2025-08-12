const cloudinary = require("../config/cloudinary.config");
const streamifier = require("streamifier");
const UserModel = require("../models/user.model");

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "None image provided" });
    }
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(req.file.buffer);
    const user = await UserModel.findByIdAndUpdate(
      req.userID,
      { profilePicture: uploadResult.secure_url },
      { new: true }
    );
    return res.status(200).json({
      message: "Imagen subida con éxito",
      profilePicture: uploadResult.secure_url,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en el servidor",
      error: err.message,
    });
  }
};

module.exports = {
  uploadProfilePicture,
};
