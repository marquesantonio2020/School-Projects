import {
  Dimensions,
  StyleSheet,
} from 'react-native'

const {width, height} = Dimensions.get('screen')

const styleBuses=StyleSheet.create( {
  container: {
      flex: 1,
  }
  , commandButton: {
      padding: 15, borderRadius: 10, backgroundColor: '#e2a303', alignItems: 'center', marginTop: 10,
  }
  , panel: {
      height: height * 0.4, padding: 20, backgroundColor: '#FFFFFF', paddingTop: 10, borderTopLeftRadius: 50, borderTopRightRadius: 50, shadowColor: '#000000', shadowOffset: {
          width: 0, height: 0
      }
      , shadowRadius: 5, shadowOpacity: 0.4,
  }
  , header: {
      justifyContent: 'center', alignItems: 'center', height, width, shadowColor: '#333333', shadowOffset: {
          width: -1, height: -3
      }
      , shadowRadius: 2, shadowOpacity: 0.4, position: 'absolute',
  }
  , panelHeader: {
      alignItems: 'center',
  }
  , panelHandle: {
      width: 40, height: 8, borderRadius: 4, backgroundColor: '#e2a303', margin: 10,
  }
  , panelTitle: {
      fontSize: 20, height: 35, color: 'gray',
  }
  , panelSubtitleLotText: {
    fontSize: 16, color: 'gray', height: 50, marginLeft: 5,  marginRight: 5, alignItems: 'center', justifyContent: 'center', textAlign: 'center',
}
  , panelSubtitle: {
      fontSize: 16, color: 'gray', height: 40, marginLeft: 5,  marginRight: 5, alignItems: 'center', justifyContent: 'center', textAlign: 'center',
  }
, panelSubtitleDistance: {
  fontSize: 16, color: 'gray', height: 50, marginLeft: 5,  marginRight: 5,marginTop: 50,  marginBottom: 50, alignItems: 'center', justifyContent: 'center', textAlign: 'center',
}
  , panelPar: {
    fontSize: 16, color: 'gray', height: 20, marginLeft: 5,  marginRight: 5, alignItems: 'center', justifyContent: 'center',
}, 
panelParv2: {
  fontSize: 16, color: 'gray', height: 40, marginLeft: 5,  marginRight: 5, alignItems: 'center', justifyContent: 'center',
}
  , panelButton: {
      flexDirection: 'row', padding: 13, borderRadius: 10, backgroundColor: '#e2a303', alignItems: 'center', justifyContent: 'center', 
  }
  , panelButtonTitle: {
      fontSize: 17, fontWeight: 'bold', color: 'white',
  }
  , actionError: {
      flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#FF0000', paddingBottom: 5,
  }
  ,
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  iconRow: {
    flexDirection: "row",
    marginTop : 10,
  },
  iconIt: {
    flexDirection: "column",
    flex:1,
    
  },
  TouchableOpacity: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    top: 30
 },
 floatingButtonStyle: {
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  width: 50,
  height: 50,
  padding: 10,
  backgroundColor:"#FCCC54",
  borderRadius: 30
},
})

const stylesDrawerContent = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})


const styleStops = StyleSheet.create({
container: {
  backgroundColor: 'white',
},
row: {
  flex: 1,
  flexDirection: 'row',
  paddingVertical: 25,
  paddingHorizontal: 15,
},
number: {
  fontWeight: 'bold',
  fontSize: 25,
  marginRight: 15,
},
title: {
  fontWeight: 'bold',
  fontSize: 20,
  marginRight: 15,
},
det: {
  fontSize: 15,
  marginRight: 15,
},
stop: {
  fontSize: 15,
  marginRight: 15,
},
})


const stylesAbout = StyleSheet.create({
  rowImage: {
    flex:1,
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '20%'
  },
  imageCmvc: {
    flex: 1,
    aspectRatio: 1.2, 
    resizeMode: 'contain',
  },
  imageEstg: {
    flex: 1,
    aspectRatio: 1.2, 
    resizeMode: 'contain',
    
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  col: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  det: {
    fontSize: 10,
    marginRight: 15,
  },
  })

  const stylesHelp = StyleSheet.create({
    container: {
      backgroundColor: 'white',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 25,
    },
    question: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    answer: {
      fontSize: 15,
    },
    quest: {
      fontSize: 15,
    },
    })

export {stylesDrawerContent, styleBuses, styleStops, stylesHelp, stylesAbout, height}