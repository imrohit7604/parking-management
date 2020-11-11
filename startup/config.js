require("dotenv").config();
module.exports = function () {
  if (!process.env.studywith_jwtPrivateKey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  
};
