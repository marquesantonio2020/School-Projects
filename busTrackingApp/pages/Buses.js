import React, { useContext, useState, useEffect, Component, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  AccessibilityInfo
} from 'react-native'
import { LocalizationContext } from '../services/localization/LocalizationContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomSheet from 'reanimated-bottom-sheet'
import Animated, { set } from 'react-native-reanimated'

/**React native google maps
 * GitHub Documentation: https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md
 */
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps'

import PushNotification from 'react-native-push-notification'

import MapViewDirections from 'react-native-maps-directions'

/**Maps operation like distance calculation, speed, etc.
 * Github Documentation: https://github.com/react-native-geolocation/react-native-geolocation
 */
import Geolocation from '@react-native-community/geolocation'

import {
  getPreciseDistance,
  convertDistance,
  findNearest,
  getPathLength,
  convertSpeed,
  isPointWithinRadius,
} from 'geolib'

/**Project's folder imports */
import BusRoute from '../coordinates/busRouteCoords'
import PointsOfInterest from '../coordinates/pointsOfInterest'
import { ActivityIndicator } from 'react-native-paper'

import { styleBuses, height } from '../Stylesheet/style'

const way = require('./waypoints.json')

const Buses = ({ navigation }) => {
  const { translations } = useContext(LocalizationContext)
  const [isAccessible, setAccessibility] = useState(false)
  const [error, setError] = useState()
  const [routeCoords, setRouteCoords] = useState([])
  const [referencePoints, setReferencePoints] = useState([])
  const [pointsOfInterest, setPointsOfInterest] = useState([])
  const [busStops, setBusStops] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [bus, setBus] = useState({ latitude: 0, longitude: 0 })
  const [buses, setBuses] = useState([
    { key: '1', latitude: 0, longitude: 0 },
    { key: '2', latitude: 0, longitude: 0 },
  ])
  const [busesPreviousPosition, setBusesPreviousPosition] = useState([
    { key: '1', latitude: 0, longitude: 0 },
    { key: '2', latitude: 0, longitude: 0 },
  ])

  const [temp, setTemp] = useState(1)
  const [temp1, setTemp1] = useState(100)

  const [point1, setPoint1] = useState({ latitude: 0, longitude: 0 })
  const [point2, setPoint2] = useState({ latitude: 0, longitude: 0 })
  const [distance, setDistance] = useState()
  const [estimateTime, setEstimateTime] = useState()

  const [activatedMarker, setActivatedMarker] = useState({ key: '' })
  const [activatedIndex, setActivatedIndex] = useState()
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 })

  const markerRefs = useRef([])
  const mapRef = useRef(null)
  const bs = useRef(null)

  const [selectedBus, setSelectedBus] = useState([])
  const [isTracking, setIsTracking] = useState(false)
  const [waypoints, setWaypoints] = useState([])
  const [inRoute, setInRoute] = useState()

  const [enterState, setState] = useState(false)
  const [isNearRoute, setIsNearRoute] = useState(false) 
  const [info, setInfo] = useState({ title: translations.ptInt, det: translations.info, desc: translations.info })
  const [userDistanceToRoute, setUserDistanceToRoute] = useState(0);
  const [userTimeToRoute, setUserTimeToRoute] = useState(0);
  const [notificationIsCreated, setNotificationIsCreated] = useState(false)

  //const [description, setDescription] = useState('Selecione autocarro para receber informações')

  const [points, setPoints] = useState({ pointA: translations.info, pointB: translations.info })

  fall = new Animated.Value(1)

  //Posição inicial do mapa
  const [initialPosition, setInitialPosition] = useState({
    latitude: 41.694677,
    longitude: -8.8315657,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })

  //Marcador inicial do mapa
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 41.69883658123638, 
    longitude: -8.823116074157802,
  })

  //Get current position
  const handleSuccess = position => {
    var lat = parseFloat(position.coords.latitude)
    var long = parseFloat(position.coords.longitude)

    var initialRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    //Set new map position
    setInitialPosition(initialRegion)
    //Set new marker position
    setMarkerPosition(initialRegion)

    setOrigin(initialRegion)
  }

  const handleError = error => {
    setError(error.message)
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(handleSuccess, handleError)
    //Check is accessibility is turned on the mobile device
    AccessibilityInfo.fetch().then((isEnabled) => {
      //True if Accessibility is turned on
      setAccessibility(isEnabled)
    });
  }, [])

  //Watch position - verificar continuamente posição do marker e map
  useEffect(() => {
    const watchId = Geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      accuracy: 'high',
      distanceFilter: 10,
    })
    return () => Geolocation.clearWatch(watchId)
  }, [])


  FloatingButtonEvent = async () => {
    Geolocation.getCurrentPosition(position => {
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
      mapRef.current.animateToRegion(region, 1000)
    })
  }

  //PONTOS NO MAPA
  useEffect(() => {
    fetch(
      'http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/references',
    )
      .then(response => response.json())
      .then(function (json) {
        const referencePoints = json.map(function (point) {
          const lat = parseFloat(point.latitude)
          const long = parseFloat(point.longitude)

          return { latitude: lat, longitude: long }
        })
        setReferencePoints(referencePoints)
      })
      .catch(error => console.error(error))

    //Fetches Buses Route
    fetch(
      'http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/routes',
    )
      .then(response => response.json())
      .then(function (json) {
        const listOfCoords = json.map(function (point) {
          const lat = parseFloat(point.lat)
          const long = parseFloat(point.long)

          return { latitude: lat, longitude: long }
        })
        //useState to be used by the application containing all coordinates of the route
        setRouteCoords(listOfCoords)
      })
      .catch(error => console.error(error))

    fetch(
      'http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/mapPoints/pointsOfInterest',
    )
      .then(response => response.json())
      .then(function (json) {
        const listOfPoints = json.map(function (point) {
          const key = point.idpointsinterested
          const lat = parseFloat(point.lat)
          const long = parseFloat(point.long)
          const detail = point.detaildescription
          const desc = point.description
          const title = point.name

          return {
            key: key,
            latitude: lat,
            longitude: long,
            title: title,
            det: detail,
            desc: desc,
          }
        })
        setPointsOfInterest(listOfPoints)
      })
      .catch(error => console.error(error))

    fetch(
      'http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/busStops/0',
    )
      .then(response => response.json())
      .then(function (json) {
        const listOfStops = json.map(function (stop) {
          const key = stop.idstops
          const lat = parseFloat(stop.lat)
          const long = parseFloat(stop.long)
          const detail = stop.description
          const title = stop.name
          const latAlert = stop.lat_alert
          const longAlert = stop.long_alert

          return {
            key: key,
            latitude: lat,
            longitude: long,
            title: title,
            det: detail,
            latitudeAlert: latAlert,
            longitudeAlert: longAlert,
          }
        })
        setBusStops(listOfStops)
      })
      .catch(error => console.error(error))
  }, [])

  //Executed when routeCoords is not null -> fetches buses for the first time
  useEffect(() => {
    if (routeCoords.length > 0) {
      var x = [...buses]
      fetch(
        `http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/busPosition/${temp}`,
      )
        .then(response => response.json())
        .then(function (json) {
          const latlong = json.map(function (coord) {
            const key = '1'
            const latitude = parseFloat(coord.lat)
            const longitude = parseFloat(coord.long)

            return { key: key, latitude: latitude, longitude: longitude }
          })
          x[0] = latlong[0]
          setBus(latlong[0])
          setTemp(temp + 2)
        })
        .catch(error => console.error(error))
      fetch(
        `http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/busPosition/${temp1}`,
      )
        .then(response => response.json())
        .then(function (json) {
          const latlong = json.map(function (coord) {
            const key = '2'
            const latitude = parseFloat(coord.lat)
            const longitude = parseFloat(coord.long)

            return { key: key, latitude: latitude, longitude: longitude }
          })

          x[1] = latlong[0]
          setTemp1(temp1 + 2)

          setBuses(x)
        })
        .catch(error => console.error(error))
      setLoading(false)
    }
  }, [routeCoords])

  //Occurs each time buses variable changes its value (timer can be changed)
  useEffect(() => {
    
    const timer = setTimeout(() => {
      var x = [...buses]
      /**Keeps track of the buses' previous positions in order
       * to assist on the calculation of each bus speed and thus
       * calculate estimate arrival time
       */
      var previousPos = [...busesPreviousPosition]

      previousPos[0] = x[0]
      previousPos[1] = x[1]

      setBusesPreviousPosition(previousPos)
      fetch(
        `http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/busPosition/${temp}`,
      )
        .then(response => response.json())
        .then(function (json) {
          const latlong = json.map(function (coord) {
            const key = '1'
            const latitude = parseFloat(coord.lat)
            const longitude = parseFloat(coord.long)

            return { key: key, latitude: latitude, longitude: longitude }
          })

          x[0] = latlong[0]
        })
        .catch(error => console.error(error))

      fetch(
        `http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/busPosition/${temp1}`,
      )
        .then(response => response.json())
        .then(function (json) {
          const latlong = json.map(function (coord) {
            const key = '2'
            const latitude = parseFloat(coord.lat)
            const longitude = parseFloat(coord.long)

            return { key: key, latitude: latitude, longitude: longitude }
          })
          x[1] = latlong[0]
          setBuses(x)
        })
        .catch(error => console.error(error))

      if (temp >= 380) {
        setTemp(1)
      } else {
        setTemp(temp + 2)
      }
      if (temp1 >= 380) {
        setTemp1(1)
      } else {
        setTemp1(temp1 + 2)
      }

    if(getPreciseDistance(findNearest(markerPosition, referencePoints), markerPosition) > 500){
      setIsNearRoute(false);
    }else{
      setIsNearRoute(true);
    }
    }, 5000)


    return () => clearTimeout(timer)
    
  }, [buses])

  //Starts the process of getting distance and estimated time of selected bus to user's closest point to the route
  const getBusInfo = (bus, index) => {
    if(isNearRoute){
    bs.current.snapTo(0)
    setActivatedIndex(index)
    setActivatedMarker({ key: bus.key })
    }else{
      Alert.alert(translations.meters);
    }
  }

  const getBusDistance = () => {
    const distanceCalculation = getPathLength(waypoints)
    const userToRoute = getPreciseDistance(findNearest(markerPosition, referencePoints), markerPosition);
    
    setUserDistanceToRoute(convertDistance(userToRoute, 'km'))
    setDistance(convertDistance(distanceCalculation, 'km'))
    console.log(markerPosition)
  }

  const getVelocity = () => {
    const velocity =
      getPreciseDistance(
        busesPreviousPosition[activatedIndex],
        buses[activatedIndex],
      ) / 2.5
    return convertSpeed(velocity, 'kmh')
  }

  const getEstimatedTime = () => {
    const userEstimateTime = (userDistanceToRoute/3) * 60 
    const velocity = getVelocity()
    //Change 30 for velocity variable
    setEstimateTime(Math.round((distance / 30) * 60))
    setUserTimeToRoute(userEstimateTime)
  }

  useEffect(() => {
    
    if (activatedMarker.key !== '') {
      const ourBus = buses[activatedIndex]
      setSelectedBus(ourBus)
      //const inRoute = checkInRoute()
      //setInRoute(inRoute)

      if (inRoute) {
        //console.log("estou dentro da rota")
        const closestToBus = findNearest(
          { latitude: ourBus.latitude, longitude: ourBus.longitude },
          routeCoords,
        )
        const closestToMarker = findNearest(markerPosition, routeCoords)

        const startWaypoint = routeCoords.findIndex(
          route =>
            route.latitude == closestToBus.latitude &&
            route.longitude == closestToBus.longitude,
        )
        const endWaypoint = routeCoords.findIndex(
          route =>
            route.latitude == closestToMarker.latitude &&
            route.longitude == closestToMarker.longitude,
        )

        if (startWaypoint < endWaypoint) {
          const listaWaypoints = routeCoords.slice(
            startWaypoint + 1,
            endWaypoint + 1,
          )
          setWaypoints(listaWaypoints)
        } else {
          const temp = routeCoords.slice(
            startWaypoint + 1,
            routeCoords.length - 1,
          )
          const listaWaypoints = temp.concat(routeCoords.slice(0, endWaypoint + 1))

          setWaypoints(listaWaypoints)
        }
      } else {
        //console.log("estou fora da rota")
        const closestToBus = findNearest(
          { latitude: ourBus.latitude, longitude: ourBus.longitude },
          routeCoords,
        )
        const closestToMarker = findNearest(markerPosition, referencePoints)
        //console.log(closestToMarker)
        const closestToReference = findNearest(
          {
            latitude: closestToMarker.latitude,
            longitude: closestToMarker.longitude,
          },
          routeCoords,
        )

        const startWaypoint = routeCoords.findIndex(
          route =>
            route.latitude == closestToBus.latitude &&
            route.longitude == closestToBus.longitude,
        )
        const endWaypoint = routeCoords.findIndex(
          route =>
            route.latitude == closestToReference.latitude &&
            route.longitude == closestToReference.longitude,
        )

        if (startWaypoint < endWaypoint) {
          //console.log('here start')
          const listaWaypoints = routeCoords.slice(
            startWaypoint + 1,
            endWaypoint + 1 ,
          )
          setWaypoints(listaWaypoints)
        } else {
          //console.log('here end')
          const temp = routeCoords.slice(
            startWaypoint + 1,
            routeCoords.length - 1,
          )
          const listaWaypoints = temp.concat(routeCoords.slice(0, endWaypoint + 1))

          setWaypoints(listaWaypoints)
        }
      }
    }
  }, [buses])

  useEffect(() => {
    if (waypoints.length > 0 && !enterState) {
      console.log(waypoints.length)
      getBusDistance()
      getEstimatedTime()

      setIsTracking(true)
    }
    
  }, [waypoints])

  useEffect(() => {
    if (enterState) {
      pointsOfInterest.map((point, index) => {
        if (isPointWithinRadius({ latitude: point.latitude, longitude: point.longitude }, { latitude: buses[activatedIndex].latitude, longitude: buses[activatedIndex].longitude }, 50)) {
          if (index < pointsOfInterest.length - 1) {
            if (index == 0) {
              setInfo({ title: pointsOfInterest[index].title, det: pointsOfInterest[index].det, desc: pointsOfInterest[index].desc });
              setPoints({ pointA: pointsOfInterest[pointsOfInterest.length - 1].title, pointB: pointsOfInterest[index + 1].title });
            } else {
              setInfo({ title: pointsOfInterest[index].title, det: pointsOfInterest[index].det, desc: pointsOfInterest[index].desc });
              setPoints({ pointA: pointsOfInterest[index - 1].title, pointB: pointsOfInterest[index + 1].title });
            }
          } else {
            setInfo({ title: pointsOfInterest[index].title, det: pointsOfInterest[index].det, desc: pointsOfInterest[index].desc });
            setPoints({ pointA: pointsOfInterest[index - 1].title, pointB: pointsOfInterest[2].title });
          }
        }
      })
    }
  }, [buses[activatedIndex], enterState])

  const changeState = () => {
    if (activatedIndex != null) {
      if (!enterState) {
        if (isPointWithinRadius({ latitude: buses[activatedIndex].latitude, longitude: buses[activatedIndex].longitude }, { latitude: markerPosition.latitude, longitude: markerPosition.longitude }, 100)) {//MUDAR PARA 50
          //console.log('ENTROU')
          Alert.alert(translations.enterReg);
          setIsTracking(false)
          setState(true)
        } else {
          Alert.alert(translations.impossibleBus);
        }
      } else {
        //console.log('SAIU')
        setState(false)
      }
    } else {
      Alert.alert(translations.choose);
    }
  }



  renderInner = () => (
    <View style={styleBuses.panel} accessible={true}>
      {/**If the button 'Go in the bus' is pressed and bus close to user -> enterState = true */}
      {enterState ? (
        <View style={{ alignItems: 'center' }} >
          <View style={styleBuses.panelHandle} />
          <View style={styleBuses.iconRow}>
            <Text style={styleBuses.panelPar}>{translations.ptInt}</Text>
          </View>
          <Text style={styleBuses.panelTitle} accessible={true} accessibilityLiveRegion="polite">{info.title}</Text>
          <Text style={styleBuses.panelSubtitle} accessible={true} accessibilityLiveRegion="polite">{info.desc}</Text>
          <View style={styleBuses.iconRow}>
            <Icon name='arrow-left' color={'gray'} size={30} accessibilityHint={translations.previousStop} />
            <Text style={styleBuses.panelPar}>{points.pointA}</Text>
          </View>
          <View style={styleBuses.iconRow}>
            <Icon name='arrow-right' color={'gray'} size={30} accessibilityHint={translations.nextStop} />
            <Text style={styleBuses.panelParv2}>{points.pointB}</Text>
          </View>
          </View>
      ) : (isNearRoute ? (<View style={{ alignItems: 'center' }}>
      <View style={styleBuses.panelHandle} />
      <Text style={styleBuses.panelTitle}>{translations.busnumber}</Text>
      <Icon name='map-marker-distance' color={'gray'} size={30} />
      <Text style={styleBuses.panelSubtitle}>
        {translations.distance}
        {isTracking ? parseFloat(distance).toFixed(2) + ' km' : '- km'}
      </Text>
      <Icon name='timer-sand' color={'gray'} size={30} />
      <Text style={styleBuses.panelSubtitleLotText}>
        {translations.estimateTime}
        {isTracking
          ? isFinite(parseInt(estimateTime))
            ? (parseInt(estimateTime) > 0) 
              ? parseInt(estimateTime) + translations.minutes + '(+' + parseInt(userTimeToRoute) + 'mins' + translations.untilRoute + ')'
              : translations.isArriving + '(+' + parseInt(userTimeToRoute) + 'mins' + translations.untilRoute + ')'
            : translations.busTime + '(+' + parseInt(userTimeToRoute) + 'mins' + translations.untilRoute + ')'
          : '-' + translations.minutes}
      </Text>
    </View>) : (<View style={{ alignItems: 'center'}}>
      <View style={styleBuses.panelHandle}/>
      <Icon  name='map-marker-distance' color={'gray'} size={40} />
      <Text style={styleBuses.panelSubtitleDistance}>{translations.nearRoute}</Text>
    </View>)
          
        )}
        {/**Button to get inside or out of the bus */}
      <TouchableOpacity style={styleBuses.panelButton} onPress={changeState}>
        <Icon name='bus' size={30} color='white' />
        <Text style={styleBuses.panelButtonTitle}>
          {enterState ? translations.exit : translations.enter}
        </Text>
      </TouchableOpacity>
    </View>
  )

  renderHeader = () => (
    <View style={styleBuses.header}>
      <View style={styleBuses.panelHeader}></View>
    </View>
  )

  return (
    <View style={styleBuses.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
          <View style={{ alignItems: 'center' }}>

            {/**Google Map that starts in Viana do Castelo*/}
            <MapView
              accessibilityLabel={translations.isABus}
              accessibilityHint={translations.busHint}
              minZoomLevel={13}
              maxZoomLevel={16}
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styleBuses.header}
              //customMapStyle={mapDarkStyle}
              initialRegion={initialPosition}
              showsUserLocation={true}
              followsUserLocation={true}
              showsPointsOfInterest={true}
              showsCompass={true}
              //showsTraffic={true}
              showsMyLocationButton={false}
              showsBuildings={true}>
              {isTracking ? (
                <View><Polyline
                  coordinates={waypoints}
                  strokeWidth={7}
                  strokeColor='green'
                />
                </View>) : (<View />)}


              {/**Component that returns route of the buses*/}
              <Polyline
                coordinates={routeCoords}
                strokeWidth={7}
                strokeColor='grey'
              />

            {/**If enterState = true then markers 
             * that represent points of interess are rendered */}
              {enterState ? (pointsOfInterest.map(marker => (
                <Marker key={marker.idpointsinterested}
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  title={marker.title}
                  description={marker.det}>
                  <Icon name='information-variant' color="red" size={20} />
                </Marker>))) : (<View />)}

              {/**Component that creates a Marker for each bus active. Each marker has a bus as an icon*/}
              {buses.map((bus, index) => (
                <Marker
                  key={bus.key}
                  coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
                  onPress={() => getBusInfo(bus, index)}>
                  <Image
                    style={{ width: 60, height: 40, resizeMode: 'contain' }}
                    source={
                      activatedMarker.key === buses[index].key
                        ? require('../assets/bus1.png')
                        : require('../assets/bus.png')
                    }
                  />
                </Marker>
              ))}

              {isAccessible ? (busStops.map(busStop => (
                <Marker
                  key={busStop.key}
                  coordinate={{
                    latitude: busStop.latitude,
                    longitude: busStop.longitude,
                  }}
                  title={busStop.title}
                  description={busStop.det}>
                  <Image
                    style={{ width: 60, height: 40, resizeMode: 'contain' }}
                    source={require('../assets/busStop.png')}
                  />
                </Marker>
              ))) : (<View />)}


              {/*MARKER ESTÁTICO VERMELHO PARA TESTE IOS
              <Marker.Animated
              coordinate={markerPosition}
              title={translations.ME}></Marker.Animated>*/}

            </MapView>
          </View>
        )}
      <TouchableOpacity activeOpacity={0.7} onPress={FloatingButtonEvent} style={styleBuses.TouchableOpacity}>
        <Icon name='crosshairs-gps' color="white" size={30} style={styleBuses.floatingButtonStyle} />
      </TouchableOpacity>
      <BottomSheet
        ref={bs}
        snapPoints={[height * 0.4, 40]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
    </View>
  )
}

export default Buses
