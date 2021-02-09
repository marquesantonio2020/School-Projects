import { Marker } from 'react-native-maps'
import React from 'react'

/**Cointans information about points of interest
 * including latitude and longitude
 */
const pointsOfInterest = require('./pointsOfInterest.json');

export default function PointsOfInterest(){

    /**Returns multiple markers using latitude, longitude and details
     * about the specific point of interest
     */
    return(
        pointsOfInterest.map((point) => 
        <Marker key={point.id}
        coordinate={{latitude: point.lat, longitude: point.long}}
        title={point.name}
        description={point.detail}>
        </Marker>)
    )
}