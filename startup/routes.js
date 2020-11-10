const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const parking_zone = require("../routes/parkingZone");
const parking_space = require("../routes/parkingSpace");
const vehicle_parking = require("../routes/vehicleParking");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/parkingZone", parking_zone);
  app.use("/api/parkingSpace", parking_space);
  app.use("/api/vehicleParking", vehicle_parking);
  app.use(error);
};
