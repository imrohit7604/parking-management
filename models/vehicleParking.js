const Joi = require("joi");
const mongoose = require("mongoose");

const vehicleParkingSchema = new mongoose.Schema({
    parkingZoneId: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  parkingSpaceId: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  registrationNumber: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  bookingDateTime:{
      type:Date,
      required: true,
  },
  releaseDateTime:{
    type:Date,
    
}   
});

const VehicalParking = mongoose.model("vehicalParkings", vehicleParkingSchema);

function validateParkingZone(vehicle) {
  const schema = {
    parkingZoneId: Joi.string().min(1).max(50).required(),
    parkingSpaceId: Joi.string().min(1).max(50).required(),
    registrationNumber: Joi.string().min(1).max(50).required(),
  };

  return Joi.validate(vehicle, schema);
}

exports.VehicalParking = VehicalParking;
exports.validate = validateParkingZone;
