const Joi = require("joi");
const mongoose = require("mongoose");

const parkingZoneSchema = new mongoose.Schema({
  parkingZoneTitle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  
});

const ParkingZone = mongoose.model("parkingZones", parkingZoneSchema);

function validateParkingZone(zone) {
  const schema = {
    parkingZoneTitle: Joi.string().min(1).max(50).required(),
  };

  return Joi.validate(zone, schema);
}

exports.ParkingZone = ParkingZone;
exports.validate = validateParkingZone;
