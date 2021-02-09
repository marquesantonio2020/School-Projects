import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import React, {useContext} from 'react'
import {View, StyleSheet, Image} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Iconv2 from 'react-native-ionicons'
import {LocalizationContext} from './../services/localization/LocalizationContext'

import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper'

import{stylesDrawerContent} from '../Stylesheet/style'

export function DrawerContent (props) {
  const {translations} = useContext(LocalizationContext)
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={stylesDrawerContent.drawerContent}>
          <Image
            style={{flex:1, height: 150, width: 120, marginLeft: 70, marginTop:20, marginEnd:20, alignItems:'center'}}
            source={require('./../assets/cmvc.png')}
          />
          <Drawer.Section style={stylesDrawerContent.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name='bus' color={color} size={size} />
              )}
              label={translations.BUSES}
              onPress={() => {props.navigation.navigate(translations.BUSES)}}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name='bus-stop' color={color} size={size} />
              )}
              label={translations.STOPS}
              onPress={() => {props.navigation.navigate(translations.STOPS)}}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name='bus-clock' color={color} size={size} />
              )}
              label={translations.SCHEDULES}
              onPress={() => {props.navigation.navigate(translations.SCHEDULES)}}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Iconv2 name='information-circle-outline' color={color} size={size} />
              )}
              label={translations.ABOUT}
              onPress={() => {props.navigation.navigate(translations.ABOUT)}}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name='help' color={color} size={size} />
              )}
              label={translations.HELP}
              onPress={() => {props.navigation.navigate(translations.HELP)}}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      {/*<Drawer.Section style={stylesDrawerContent.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Iconv2 name='settings' color={color} size={size} />
          )}
          label={translations.SETTINGS}
          onPress={() => {props.navigation.navigate(translations.SETTINGS)}}
        />
          </Drawer.Section>*/}
    </View>
  )
}


