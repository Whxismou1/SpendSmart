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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password didnt match " });
    }

    const user = await UserModel.findById(req.userID);

    if (!user) {
      return res.status(400).json({ message: "Invalid operation." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;

    await user.save();
    return res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  uploadProfilePicture,
  changePassword
};
