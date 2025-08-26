const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountActivated: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    profilePicture:{
      type: String
    },
    verificationCodeExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /\+?\d{7,15}$/.test(v);
        },
        message: (props) =>
          `${props.value} no es un número de teléfono válido!`,
      },
    },
    currency: {
      type: String,
      enum: ["USD", "EUR"],
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
