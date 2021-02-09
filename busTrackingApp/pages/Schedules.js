import React, {useContext, useState, useEffect} from 'react'
import {View, Text, Button, StyleSheet, Image} from 'react-native'
import {LocalizationContext} from '../services/localization/LocalizationContext'


function Schedules ({navigation}) {
  const {translations} = useContext(LocalizationContext)
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{translations.SCHEDULES}</Text>
      <Text>Horários Fixos das periferias agrupados por companhia</Text>
    </View>
  );
}
export default Schedules;


