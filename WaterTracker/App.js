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

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Tracker" component={WaterTracker} />
        <Stack.Screen name="Data" component={AllWaterData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
