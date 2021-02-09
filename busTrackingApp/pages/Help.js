
import React, {useContext, useState, useEffect} from 'react'
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native'
import {LocalizationContext} from './../services/localization/LocalizationContext'

import{stylesHelp} from '../Stylesheet/style'

function Help ({navigation}) {
  const {translations} = useContext(LocalizationContext)
  const [questions, setQuestions] = useState([])

  const ItemView = ({item}) => {
    return (
      <View style={stylesHelp.row}>
        <View style={stylesHelp.quest}>
          <Text style={stylesHelp.question}>{item.quest}</Text>
          <Text style={stylesHelp.answer}>{item.answer}</Text>
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

  useEffect(() => {
    fetch(
      'http://projetoiii-busapp.000webhostapp.com/slimFramework/index.php/api/questions',
    )
      .then(response => response.json())
      .then(function (json) {
        const listOfQuestions = json.map(function (question) {
            const quest = question.question
            const answer = question.answer

            return {
              quest: quest,
              answer: answer,
            }
        })
        setQuestions(listOfQuestions)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <FlatList
        data={questions}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
    </View>
  )
}


export default Help;

