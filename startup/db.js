const winston = require("winston");
const mongoose = require("mongoose");

require("dotenv").config();
module.exports = function () {
  mongoose.set("useNewUrlParser", true);

  mongoose
    .connect("mongodb+srv://Rohit123:Rohit123@cluster0.oxzda.mongodb.net/rohit?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.info(`Connected to monogDB...`));
};
