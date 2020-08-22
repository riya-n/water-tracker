/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WaterTracker from './WaterTracker';
import AllWaterData from './AllWaterData';

const Stack = createStackNavigator();

const theme = {
  colors: {
    primary: '#ce5e7d',
    background: 'white',
    border: 'white',
  },
};

const App: () => React$Node = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Tracker"
          component={WaterTracker}
          options={{
            title: 'Daily Tracker',
            headerTitleStyle: {
              fontSize: 30,
            },
            headerStyle: {
              height: 130,
            },
          }}
        />
        <Stack.Screen
          name="Data"
          component={AllWaterData}
          options={{
            title: 'All Water Data',
            headerTitleStyle: {
              fontSize: 30,
            },
            headerStyle: {
              height: 130,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
