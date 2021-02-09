import { Polyline } from 'react-native-maps'
import React, { useState } from 'react'

/**Contains Latitude and Longitude to draw the route */
const listOfCoords = require('./busRouteCoordinates.json')

export default function BusRoute() {
    const [listOfCoords, setListOfCoords] = useState([])


    const getRoutes = () => {
        fetch('http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/routes')
          .then((response) => response.json())
          .then(function (json) {
            
            const data = json.map(function(point){
              const lat = point.lat;
              const long = point.long;
    
              return {lat: lat, long: long}
            });
            console.warn(data);
            setListOfCoords(data);
            return data;
          })
          .catch((error) => console.error(error))
      };

    /**Return a drawn route using latitude and longitude of multiple
     * points of the map
     */

    return (
        <Polyline
            coordinates={getRoutes}
            strokeWidth={2}
            strokeColor="red" />
    )
}
