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
    h: 100,
  };
  _onPress = () => {
    LayoutAnimation.spring();
    this.setState({h: this.state.h + 15});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.bar, {height: this.state.h}]} />
        <TouchableOpacity onPress={this._onPress} style={styles.button}>
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
});
