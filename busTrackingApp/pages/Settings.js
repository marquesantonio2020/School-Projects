import React, {useContext, useState, useEffect} from 'react'
import {View, Text, Button} from 'react-native'
import {LocalizationContext} from './../services/localization/LocalizationContext'

function Settings ({navigation}) {
  const {translations} = useContext(LocalizationContext)
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{translations.SETTINGS}</Text>
    </View>
  );
}

export default Settings
