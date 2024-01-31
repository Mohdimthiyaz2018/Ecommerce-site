const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: [true, "Duplicate email found!"],
    validate: [validator.isEmail, "Please enter the valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    maxlength: [8, "Password cannot exceed 8 characters!"],
    select: false,
  },
  avatar: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpire: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
    if(this.password != null)
    {
        this.password = await bcrypt.hash(this.password, 10);
    }
  
});

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.isValidPassword = async function (enterredPassword) {
  return await bcrypt.compare(enterredPassword, this.password);
};

async function generateRandomToken() {
    return crypto.randomBytes(20).toString('hex');
}

userSchema.methods.resetToken = async function () {
  const token = await generateRandomToken();
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordTokenExpire = Date.now() + 30 + 60 + 1000;

  return token;
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
