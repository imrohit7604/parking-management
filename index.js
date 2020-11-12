const express = require("express");
const app = express();

var cors = require('cors')

app.use(cors()) ;
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();


const port =  3002;
app.listen(port, () => console.info(`Listening on port ${port}...`));
