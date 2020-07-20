import React from 'react';
import {
  NativeModules,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class WaterTracker extends React.Component {
  state = {
    h: 0,
  };
  _onPress = () => {
    LayoutAnimation.spring();
    this.setState({h: this.state.h + 0.1});
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>How much water have I had today?</Text>
        <TouchableOpacity onPress={this._onPress} style={styles.button}>
          <Text style={styles.buttonText}>Add 100 ml</Text>
        </TouchableOpacity>
        <View style={[styles.bar, {height: this.state.h * 100}]} />
        <View style={styles.line}>
          <Text style={styles.subtitle}>Goal</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginVertical: 30,
    marginHorizontal: 30,
    fontSize: 40,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 30,
  },
  bar: {
    backgroundColor: '#ADD8E6',
    width: WIDTH * 0.3,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'flex-start',
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
  line: {
    width: WIDTH,
    borderTopWidth: 5,
    borderTopColor: '#FFCCCB',
  },
});
