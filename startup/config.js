require("dotenv").config();

//Check private is defined 
module.exports = function () {
  if (!process.env.parking_jwtPrivateKey) {
    console.log("FATAL ERROR: jwtPrivateKey is not defined.")
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  if (!process.env.mongoDB) {
    console.log("FATAL ERROR: mongoDB is not defined.")
    throw new Error("FATAL ERROR: mongoDB is not defined.");
  }
};
