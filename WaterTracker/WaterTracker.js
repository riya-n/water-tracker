/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  NativeModules,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BASE_HEIGHT = -HEIGHT * 0.7 + 30;

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class WaterTracker extends React.Component {
  state = {
    barHeight: 0,
    goalHeight: BASE_HEIGHT + 230,
    goalReached: false,
    isModalVisible: false,
    goalText: '',
  };

  _onPress = () => {
    LayoutAnimation.spring();

    if (this.state.barHeight + 0.1 > 5.3) {
      console.log('tooo biggg');
    } else {
      this.setState({
        barHeight: this.state.barHeight + 0.1,
        goalHeight: -HEIGHT * 0.4,
      });
    }

    if (this.state.barHeight > 1) {
      this.setState({
        goalReached: true,
      });
    }
  };

  _onPressForModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });

    // TODO add validation checks for number
    if (this.state.goalText !== '') {
      this.setState({
        goalHeight: BASE_HEIGHT + this.state.goalText * 100,
        goalText: '',
      });
    }
  };

  _setText = (value) => {
    this.setState({
      goalText: value,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>How much water have I had today?</Text>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                onChangeText={(value) => this._setText(value)}
                value={this.state.goalText}
                placeholder="e.g., 2.3"
              />
              <Text style={styles.modalText}>L</Text>

              <TouchableOpacity
                onPress={this._onPressForModal}
                style={styles.button}>
                <Text style={styles.buttonText}>Set New Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View
          style={[
            styles.goalLine,
            {
              bottom: this.state.goalHeight,
              borderTopColor: this.state.goalReached ? '#2ECC40' : '#FF4136',
            },
          ]}>
          <TouchableOpacity onPress={this._onPressForModal}>
            <Text
              style={[
                styles.subtitle,
                {color: this.state.goalReached ? '#2ECC40' : '#FF4136'},
              ]}>
              Set Goal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.markerLine, {bottom: BASE_HEIGHT + 500}]}>
          <Text style={styles.markerText}>5L</Text>
        </View>

        <View style={[styles.markerLine, {bottom: BASE_HEIGHT + 400}]}>
          <Text style={styles.markerText}>4L</Text>
        </View>

        <View style={[styles.markerLine, {bottom: BASE_HEIGHT + 300}]}>
          <Text style={styles.markerText}>3L</Text>
        </View>

        <View style={[styles.markerLine, {bottom: BASE_HEIGHT + 200}]}>
          <Text style={styles.markerText}>2L</Text>
        </View>

        <View style={[styles.markerLine, {bottom: BASE_HEIGHT + 100}]}>
          <Text style={styles.markerText}>1L</Text>
        </View>

        <View style={styles.trackerContainer}>
          <View style={[styles.bar, {height: this.state.barHeight * 100}]} />

          <TouchableOpacity onPress={this._onPress} style={styles.button}>
            <Text style={styles.buttonText}>Add 100 ml</Text>
          </TouchableOpacity>
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
    textAlign: 'right',
    marginVertical: 10,
    fontSize: 15,
    zIndex: 999,
  },
  goalLine: {
    width: WIDTH * 0.7,
    borderTopWidth: 5,
    position: 'absolute',
    zIndex: 999,
    opacity: 0.8,
  },
  trackerContainer: {
    position: 'absolute',
    bottom: -HEIGHT * 0.7,
  },
  bar: {
    backgroundColor: '#ADD8E6',
    width: WIDTH * 0.3,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'center',
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
  markerLine: {
    width: WIDTH * 0.7,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    opacity: 0.7,
    position: 'absolute',
  },
  markerText: {
    textAlign: 'left',
    color: '#DDDDDD',
    marginVertical: 10,
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
