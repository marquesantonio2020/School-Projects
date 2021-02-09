import React, {useContext, useState, useEffect} from 'react'
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native'
import {LocalizationContext} from './../services/localization/LocalizationContext'

import{styleStops} from '../Stylesheet/style'

function Stops ({navigation}) {
  const {translations} = useContext(LocalizationContext)
  const [busStops, setbusStops] = useState([])

  const ItemView = ({item}) => {
    return (
      <View style={styleStops.row} onPress={() => getItem(item)}>
        <Text style={styleStops.number}>{item.key}</Text>
        <View style={styleStops.stop}>
          <Text style={styleStops.title}>{item.title}</Text>
          <Text style={styleStops.detail}>{item.det}</Text>
        </View>
      </View>
    )
  }

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#e2a303',
        }}
      />
    )
  }

  /*const getItem = item => {
    // Function for click on an item
    Alert.alert(
      item.key + ' - ' + item.title,
      item.det,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    )
  }*/

  //PONTOS NO MAPA
  useEffect(() => {
    fetch(
      'http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/busStops/0',
    )
      .then(response => response.json())
      .then(function (json) {
        const listOfStops = json.map(function (stop, index) {
            const key = index + 1
            const lat = parseFloat(stop.lat)
            const long = parseFloat(stop.long)
            const detail = stop.description
            const title = stop.name

            return {
              key: key,
              latitude: lat,
              longitude: long,
              title: title,
              det: detail,
            }
        })
        setbusStops(listOfStops)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <FlatList
        data={busStops}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
    </View>
  )
}

export default Stops;
