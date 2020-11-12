require("dotenv").config();
module.exports = function () {
  if (!process.env.parking_jwtPrivateKey) {
    console.log("FATAL ERROR: jwtPrivateKey is not defined.")
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  
};
