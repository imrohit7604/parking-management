function sortByAsec(state) {

    state.sort(function (a, b) {
      return a.value - b.value;
    });
    
    state.sort(function(a, b) {
      var nameA = a.title.toUpperCase(); // ignore upper and lowercase
      var nameB = b.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    
    return state;
}

 function addRegis(vehicalDetails, parkingSpaces,zoneId=null) {
     const newParkingSpace=[];
    parkingSpaces.forEach(space => {

        const {parkingZoneId,_id,parkingSpaceTitle}=space;
       let registrationNumber=null;
        if(parkingSpaceTitle.vehicleId!=null)
        {
            vehicalDetails.forEach(vehicalDetail=>{
                if(vehicalDetail._id.toString()==parkingSpaceTitle.vehicleId.toString())
                registrationNumber=vehicalDetail.registrationNumber;
            })
        }
        if(zoneId&&zoneId!=null)
        {
            if(zoneId.toString()==parkingZoneId)
            newParkingSpace.push({parkingSpaceTitle,parkingSpaceId:_id,parkingZoneId,registrationNumber});
        }
        else
        newParkingSpace.push({parkingSpaceTitle,parkingSpaceId:_id,parkingZoneId,registrationNumber});
        
    });
    return newParkingSpace;
  }
  function calaculateParkingDetails(vehicalDetails, parkingSpaces,zones,date) {
    let result=[];
    
    const vehicalDetailsMap=new Map();
    const parkingSpacesMap=new Map();
    vehicalDetails.forEach(detail=>{

        const {bookingDateTime}=detail;
        
        if(bookingDateTime.getDate() === date.day &&
        bookingDateTime.getMonth()  === date.month &&
        bookingDateTime.getFullYear() === date.year)
        {
            
            if(!vehicalDetailsMap.has(detail.parkingSpaceId))
                vehicalDetailsMap.set(detail.parkingSpaceId,1);
            else
            {
               let count= vehicalDetailsMap.get(detail.parkingSpaceId);
               count++;
               vehicalDetailsMap.set(detail.parkingSpaceId,count);
            }
        }
    });
    const currentDate=new Date();
    
    parkingSpaces.forEach(space=>{
        const spaceId=space._id.toString();
        const values={noOfBookings:0,vehicleParked:0};
        values.noOfBookings=vehicalDetailsMap.get(spaceId);
            if(currentDate.getDate()===date.day&&currentDate.getMonth()===date.month&&currentDate.getFullYear()===date.year)
        values.vehicleParked=space.parkingSpaceTitle.vehicleId?1:0;
        else
        values.vehicleParked=0;
        const spaceValues={title:space.parkingSpaceTitle.title,
                            value:values};
        if(!parkingSpacesMap.has(space.parkingZoneId))
            parkingSpacesMap.set(space.parkingZoneId,[spaceValues]);
        else
        {
           let temp= parkingSpacesMap.get(space.parkingZoneId);
           temp.push(spaceValues);
           parkingSpacesMap.set(space.parkingZoneId,temp);
        }
    })
    zones.forEach(zone=>{
        const zoneId=zone._id.toString();
        if(parkingSpacesMap.has(zoneId))
        {
            let value=parkingSpacesMap.get(zoneId);
            value=sortByAsec(value);
           
            result.push({title:zone.parkingZoneTitle,value});
        }
    })
    
    result=sortByAsec(result);
    return result;
 }

 function resetData(spaces) {
const vehicleIds=[];
const newSpace=[];
   spaces.forEach(space=>{
       const{vehicleId}=space.parkingSpaceTitle;
       if(vehicleId)
       {
        vehicleIds.push(vehicleId);
        newSpace.push(space);
       }
   });
   return {vehicleIds,newSpace};    
    
}
 module.exports.calaculateParkingDetails = calaculateParkingDetails;
  module.exports.addRegis = addRegis;
  module.exports.resetData = resetData;