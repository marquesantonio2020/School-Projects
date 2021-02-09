import * as React from 'react'
import {useContext} from 'react'
import {Image,View, Alert, Button} from 'react-native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {NavigationContainer} from '@react-navigation/native'
import {LocalizationContext} from './../services/localization/LocalizationContext'

import Buses from './../pages/Buses'
import About from './../pages/About'
import Schedules from './../pages/Schedules'
import Help from './../pages/Help'
import Settings from './../pages/Settings'
import Stops from './../pages/Stops'
import { DrawerContent } from './DrawerContent'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Drawer = createDrawerNavigator()

export default function DrawerRoute () {
  const {translations} = useContext(LocalizationContext)
  
  return (
    <NavigationContainer>
      <Drawer.Navigator inicialRouteName='Buses' drawerContent={props => <DrawerContent {...props}/>}>
        <Drawer.Screen name={translations.BUSES} component={Buses}  /*options={navigationOptionsHeader}*/ />
        <Drawer.Screen name={translations.STOPS} component={Stops} />
        <Drawer.Screen name={translations.SCHEDULES} component={Schedules} />
        <Drawer.Screen name={translations.SETTINGS} component={Settings} />
        <Drawer.Screen name={translations.ABOUT} component={About} />
        <Drawer.Screen name={translations.HELP} component={Help} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
