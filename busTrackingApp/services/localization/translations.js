import LocalizedStrings from 'react-native-localization';
export const DEFAULT_LANGUAGE = 'en';

const translations = {
  en: {
    BUSES: 'Buses',
    STOPS: 'Stops',
    SETTINGS: 'Settings',
    ABOUT: 'About',
    HELP: 'Help',
    SCHEDULES: 'Schedules',
    ME: 'Me',
    enter: 'Get in Bus',
    exit: 'Get out Bus',
    busnumber: 'Bus',
    distance: 'Distance: ',
    estimateTime: 'Estimated Time: ',
    aboutUs: 'About Us',
    objective: 'Objective',
    authors: 'Authors',
    orientation: 'Orientation',
    textAbt: 'Town Hall of Viana do Castelo alongside School of Management and Technology of the Polytechnic Institute of Viana do Castelo...',
    textObj: 'Our mission is to reduce the impact of CO2 and help visually impaired people.',
    textPro: 'Professor Sara Paiva',
    location: 'Location',
    closest: 'Closest Place',
    ptInt: 'Points of Interess',
    enterReg: 'Got on the bus',
    impossibleBus: 'Impossible to get on the bus is too far away',
    choose: 'Choose a bus',
    minutes: ' minutes',
    info : 'No information',
    busTime: 'Bus is stopped',
    isABus: 'Bus',
    busHint: 'Obtain information about distance and arrival time. A new area is going to become available at the bottom, with a button',
    nextStop: 'Next Stop',
    previousStop: 'Previous Stop',
    isArriving: 'Bus is arriving',
    nearRoute: 'Bus route is placed atleast 500 meters (10 minutes) of distance. Please get closer to route',
    timeLeft: 'More ',
    lackTime: ' Still',
    untilRoute: ' until route',
    meters: 'You need to get 500 meters from the route'
  },
  pt: {
    BUSES: 'Autocarros',
    STOPS: 'Paragens',
    SETTINGS: 'Definições',
    ABOUT: 'Sobre',
    HELP: 'Ajuda',
    SCHEDULES: 'Horários',
    ME: 'Eu',
    enter: 'Entrar no Autocarro',
    exit: 'Sair do Autocarro',
    busnumber: 'Autocarro',
    distance: 'Distância: ',
    estimateTime: 'Tempo estimado: ',
    aboutUs: 'Sobre',
    objective: 'Objetivo',
    authors: 'Autores',
    orientation: 'Orientação',
    textAbt: 'A Câmara Municipal de Viana do Castelo em conjunto com a Escola Superior de Tecnologia e Gestão do IPVC...',
    textObj: 'O nosso objetivo é reduzir a emissão de CO2 e ajudar as pessoas a movimentarem-se na cidade de Viana do Castelo',
    textPro: 'Professora Sara Paiva',
    location: 'Localização',
    closest: 'Local mais próximo da rota',
    ptInt: 'Pontos de Interesse',
    enterReg: 'Entrou no Autocarro',
    impossibleBus: 'Impossível entrar no autocarro encontra-se muito distante',
    choose: 'Selecione um autocarro!',
    minutes: ' minutos',
    info : 'Sem informações',
    busTime: 'Autocarro parado',
    isABus: 'Autocarro',
    busHint: 'Obter distância e tempo estimado de chegada. Irá ser aberto uma pequena área no inferior do ecrã com um botão',
    nextStop: 'Próxima Paragem',
    previousStop: 'Paragem Anterior',
    isArriving: 'Autocarro próximo',
    nearRoute: 'Encontra-se a mais de 500 metros(10 minutos) da rota dos autocarros. Por favor aproxime-se da rota',
    timeLeft: 'Mais ',
    lackTime: ' Faltam ',
    untilRoute: ' até à rota',
    meters: 'Precisa de estar a menos de 500 metros da rota'
  }
};

export default new LocalizedStrings(translations);