import React, {useContext, useState, useEffect} from 'react'
import {View, Text, Button, StyleSheet, Image} from 'react-native'
import {LocalizationContext} from './../services/localization/LocalizationContext'

import{stylesAbout} from '../Stylesheet/style'

function About ({navigation}) {
  const {translations} = useContext(LocalizationContext);

  return (
    <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
      <View style={stylesAbout.rowImage}>
      <Image style={stylesAbout.imageCmvc} source={require('../assets/cmvc.png')}></Image>
      <Image style={stylesAbout.imageEstg} source={require('../assets/IPVCLOGO.png')}></Image>
      </View>
      <View style={stylesAbout.row}>
      <View style={stylesAbout.col}>
      <Text style={stylesAbout.title}>{translations.aboutUs}</Text>
      <Text style={stylesAbout.text}>{translations.textAbt}</Text>
      </View>
      </View>
      <View style={stylesAbout.row}>
      <View style={stylesAbout.col}>
      <Text style={stylesAbout.title}>{translations.objective}</Text>
      <Text style={stylesAbout.text}>{translations.textObj}</Text>
      </View>
      </View>
      <View style={stylesAbout.row}>
      <View style={stylesAbout.col}>
      <Text style={stylesAbout.title}>{translations.authors}</Text>
      <Text style={stylesAbout.text}>António José Ribeiro Marques</Text>
      <Text style={stylesAbout.text}>Nelson Filipe Faria Campinho</Text>
      </View>
      </View>
      <View style={stylesAbout.row}>
      <View style={stylesAbout.col}>
      <Text style={stylesAbout.title}>{translations.orientation}</Text>
      <Text style={stylesAbout.text}>{translations.textPro}</Text>
      </View>
      </View>
    </View>
  ); 
}

export default About;


