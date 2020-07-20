import React, {Component, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {BarChart} from 'react-native-animated-charts';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class DailyWaterTracker extends Component {
  constructor() {
    super();

    this.state = {
      today: 0,
      dataY: [10.3, 8.1, 0.7],
      labels: ['10.3L', '8.1L', '0.7L'],
    };
  }

  recalculate = () => {
    let values = Array.from(
      {length: 5},
      () => Math.round(10 * Math.random() * 5) / 10,
    );
    // this.setState({
    //   today: this.state.today + 0.1,
    //   yesterday: 10.2,
    //   dayBefore: 8.3,
    //   dataY: [this.state.dayBefore, this.state.yesterday, this.state.today],
    //   labels: [
    //     `${this.state.dayBefore}L`,
    //     `${this.state.yesterday}L`,
    //     `${this.state.today}L`,
    //   ],
    // });
  };

  getData = () => {
    return {
      data: [10.3, 8.1, 0.7],
      labels: ['10.3L', '8.1L', `0L`],
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <BarChart
          labels={['10.3L', '8.1L', '0.7L']}
          dataY={[10.3, 8.1, 0.7]}
          color={'#ADD8E6'}
          height={HEIGHT * 0.6}
          containerStyles={styles.barChart}
        />
        <TouchableOpacity onPress={this.recalculate} style={styles.button}>
          <Text style={styles.buttonText}>Add 100 ml</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    marginTop: 30,
    width: WIDTH * 0.4,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  barChart: {
    backgroundColor: 'transparent',
    height: HEIGHT * 0.7,
    width: WIDTH,
    marginTop: 30,
  },
});
