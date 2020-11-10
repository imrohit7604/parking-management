const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const { VehicalParking ,validate} = require("../models/vehicleParking");
const { ParkingSpace } = require("../models/parkingSpace");
const { ParkingZone } = require("../models/parkingZone");
const express = require("express");
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

router.get("/", auth, async (req, res) => {
  const zones = await VehicalParking.find();
  res.send(zones);
});
router.post("/", [auth,admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  if(!(ObjectId.isValid(req.body.parkingZoneId)&&ObjectId.isValid(req.body.parkingSpaceId)))
     return res.status(400).json({ error: "Bad Request" });
 
    const parking_zone= await ParkingZone.findOne({ _id: new ObjectId(req.body.parkingZoneId) });
    const parking_space= await ParkingSpace.findOne({ _id: new ObjectId(req.body.parkingSpaceId) });
   console.log("parking_zone",parking_zone);
   console.log("parking_space",parking_space);

    if(!(parking_zone&&parking_space))
    return res.status(400).json({ error: "Bad Request" });
    
    const {vehicleId}=parking_space.parkingSpaceTitle;
    if(vehicleId)
    return res.status(400).json({ error: "Given Space is already consumed." });

  let vehicle_parking= await VehicalParking.findOne({ registrationNumber: req.body.registrationNumber });
  if (vehicle_parking!=null&&vehicle_parking.releaseDateTime==null) return res.status(400).json({ error: "Vehicle  is already present." });

  vehicle_parking = new VehicalParking({parkingZoneId:req.body.parkingZoneId,
                                        parkingSpaceId:req.body.parkingSpaceId,
                                        registrationNumber:req.body.registrationNumber,
                                        bookingDateTime:new Date(),
                                        releaseDateTime:null});
  
  vehicle_parking=await vehicle_parking.save();
  await ParkingSpace.findByIdAndUpdate(parking_space._id,{
    parkingSpaceTitle:{...parking_space.parkingSpaceTitle,vehicleId:vehicle_parking._id}
  })
  res.json({ message: "Saved Successfully !!" });
});

router.put("/", [auth,admin], async (req, res) => {

  const { vehicle_Id } = req.body
  if (!vehicle_Id) return res.status(400).json({ error: "Bad Request" });

  let vehicle_parking= await VehicalParking.findById( vehicle_Id );
  if (!vehicle_parking) return res.status(404).json({ error: "Not Found!!" });

  const parking_zone= await ParkingZone.findOne({ _id: new ObjectId(vehicle_parking.parkingZoneId) });
  const parking_space= await ParkingSpace.findOne({ _id: new ObjectId(vehicle_parking.parkingSpaceId) });
  
  if(!(parking_zone&&parking_space))
    return res.status(400).json({ error: "Bad Request" });
    
  const {vehicleId}=parking_space.parkingSpaceTitle;
  if(!vehicleId)
    return res.status(400).json({ error: "Given Space is already released." }); 

  await VehicalParking.findByIdAndUpdate(vehicle_parking._id,{
                                        releaseDateTime:new Date()});
  vehicle_parking=await vehicle_parking.save();
  
    await ParkingSpace.findByIdAndUpdate(parking_space._id,{
    parkingSpaceTitle:{...parking_space.parkingSpaceTitle,vehicleId:null}
  })

  res.json({ message: "Updated Successfully !!" });
});

module.exports = router;
