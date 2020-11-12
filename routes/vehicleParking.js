const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const { VehicalParking ,validate} = require("../models/vehicleParking");
const { ParkingSpace } = require("../models/parkingSpace");
const { ParkingZone } = require("../models/parkingZone");
const express = require("express");
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const {calaculateParkingDetails,resetData}=require("../util/parkingUtil")

router.get("/", auth, async (req, res) => {
  const parkings = await VehicalParking.find();
  res.send(parkings);
});
router.get("/parkingDetails", auth, async (req, res) => {
  const parkings = await VehicalParking.find();
  const zones=await ParkingZone.find();
  const spaces=await ParkingSpace.find();
  const result=calaculateParkingDetails(parkings,spaces,zones);
  res.send(result);
});

router.get("/reset", [auth,admin], async (req, res) => {
  const spaces=await ParkingSpace.find();
 const {vehicleIds,newSpace}= resetData(spaces);
vehicleIds.forEach(async({_id})=>{
  await VehicalParking.findByIdAndUpdate(_id,{
    releaseDateTime:new Date()});
});
newSpace.forEach(async(parking_space)=>{
  await ParkingSpace.findByIdAndUpdate(parking_space._id,{
    parkingSpaceTitle:{...parking_space.parkingSpaceTitle,vehicleId:null}
  })
});

  res.json({ message: "Saved Successfully !!" });
});
router.post("/", [auth,admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  if(!(ObjectId.isValid(req.body.parkingZoneId)&&ObjectId.isValid(req.body.parkingSpaceId)))
     return res.status(400).json({ error: "Bad Request" });
 
    const parking_zone= await ParkingZone.findOne({ _id: new ObjectId(req.body.parkingZoneId) });
    const parking_space= await ParkingSpace.findOne({ _id: new ObjectId(req.body.parkingSpaceId) });
   

    if(!(parking_zone&&parking_space))
    return res.status(400).json({ error: "Bad Request" });
    
    const {vehicleId}=parking_space.parkingSpaceTitle;
    if(vehicleId)
    return res.status(400).json({ error: "Given Space is already consumed." });

  let vehicle_parking= await VehicalParking.find({ registrationNumber: req.body.registrationNumber });
  
  let flag=false;
  vehicle_parking.forEach(vehicle => {
    if (vehicle.releaseDateTime==null) 
    flag=true;
  });
  if(flag===true)
  return res.status(400).json({ error: "Vehicle  is already present." });
  

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
