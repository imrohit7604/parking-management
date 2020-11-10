const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const { ParkingZone, validate } = require("../models/parkingZone");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const zones = await ParkingZone.find();
  res.send(zones);
});
router.post("/", [auth,admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let parking_zone = await ParkingZone.findOne({ parkingZoneTitle: req.body.parkingZoneTitle });
  if (parking_zone) return res.status(400).json({ error: "Parking Zone is already present." });

  parking_zone = new ParkingZone(_.pick(req.body, ["parkingZoneTitle"]));
  
  await parking_zone.save();
  res.json({ message: "Saved Successfully !!" });
});


module.exports = router;
