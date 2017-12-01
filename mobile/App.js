import Expo from 'expo';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import navigation, { StackNavigator } from 'react-navigation';
// import vision from 'react-cloud-vision-api';

import { withAuth } from './Auth';

import AuthDemoScreen from './screens/AuthDemoScreen';
import HomeScreen from './screens/HomeScreen';
import FetchDemoScreen from './screens/FetchDemoScreen';
import CameraDemoScreen from './screens/CameraDemoScreen';
import TranslationScreen from './screens/TranslationScreen';

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  AuthDemo: {
    screen: AuthDemoScreen,
    navigationOptions: {
      headerTitle: 'Auth Demo',
    },

  },
  FetchDemo: {
    screen: FetchDemoScreen,
    navigationOptions: {
      headerTitle: 'Fetch Demo',
    },
  },
  CameraDemo: {
    screen: CameraDemoScreen,
    navigationOptions: {
      headerTitle: 'Camera Screen',
    },
  },
  Translation: {
    screen: TranslationScreen,
    navigationOptions: {
      headerTitle: 'Translate',
    },
  },
});

class App extends React.Component {

  render() {
    // screenProps is one way to pass props to a navigator
    // https://reactnavigation.org/docs/navigators/navigation-options#Two-Ways-to-specify-each-option
    return <RootNavigator screenProps={this.props} />
  }

}

Expo.registerRootComponent(withAuth(App));
