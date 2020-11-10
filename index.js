const express = require("express");
const app = express();

//require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
var cron = require("node-cron");

const port = process.env.PORT || 3000;
app.listen(port, () => console.info(`Listening on port ${port}...`));
