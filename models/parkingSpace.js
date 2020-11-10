const Joi = require("joi");
const mongoose = require("mongoose");

const parkingSpaceSchema = new mongoose.Schema({
  parkingSpaceTitle: {
    type: Object,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  parkingZoneId:{
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  }
  
});

const ParkingSpace = mongoose.model("parkingSpaces", parkingSpaceSchema);

function validateParkingSpace(space) {
  const schema = {
    parkingSpaceTitle: Joi.object().min(1).max(50).required(),
    parkingZoneId:Joi.string().min(1).max(50).required(),
  };

  return Joi.validate(space, schema);
}

exports.ParkingSpace = ParkingSpace;
exports.validate = validateParkingSpace;
