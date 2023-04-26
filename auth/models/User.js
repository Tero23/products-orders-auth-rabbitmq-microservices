const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user must have a name!"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please provide an email!"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  password: {
    type: String,
    minlength: [10, "password length must be minimum 10 characters long!"],
    required: [true, "A password is required!"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      // This only works on create() and save()
      validator: function (value) {
        return value === this.password;
      },
      message: "Incorrect password confirmation!",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model("User", userSchema);

module.exports = User;
