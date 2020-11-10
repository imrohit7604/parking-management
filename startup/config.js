require("dotenv").config();
module.exports = function () {
  if (!process.env.studywith_jwtPrivateKey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  if (!process.env.email_ID) {
    throw new Error("FATAL ERROR: email_ID is not defined.");
  }
  if (!process.env.email_Password) {
    throw new Error("FATAL ERROR: email_Password is not defined.");
  }
};
