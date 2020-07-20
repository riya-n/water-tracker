/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native';

import DailyWaterTracker from './DailyWaterTracker.js';

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView>
        <DailyWaterTracker />
      </SafeAreaView>
    </>
  );
};

export default App;
