const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const { ParkingSpace, validate } = require("../models/parkingSpace");
const { ParkingZone } = require("../models/parkingZone");
const express = require("express");
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

router.get("/", auth, async (req, res) => {
  const zones = await ParkingSpace.find();
  res.send(zones);
});
router.post("/", [auth,admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  if(!ObjectId.isValid(req.body.parkingZoneId))
     return res.status(400).json("Bad Request");
 
    const parking_zone= await ParkingZone.findOne({ _id: new ObjectId(req.body.parkingZoneId) });
    if(!parking_zone)
    return res.status(400).json("Bad Request");
    
  let parking_space = await ParkingSpace.findOne({ parkingSpaceTitle: req.body.parkingSpaceTitle });
  if (parking_space) return res.status(400).json({ error: "Parking Space is already present." });

  parking_space = new ParkingSpace(_.pick(req.body, ["parkingSpaceTitle","parkingZoneId"]));
  
  await parking_space.save();
  res.json({ message: "Saved Successfully !!" });
});


module.exports = router;
