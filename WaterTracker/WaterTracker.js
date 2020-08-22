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
import {
  updateWaterCount,
  updateWaterGoal,
  getWaterCount,
  getWaterGoal,
  updateCounterTotal,
  updateCounterOne,
  updateCounterThree,
  updateCounterFive,
} from './firebase.js';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BASE_HEIGHT = -HEIGHT * 0.7 + 30;
const MAX_BAR_HEIGHT = 5.3;

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class WaterTracker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      barHeight: 0,
      goalHeight: 230,
      goalReached: false,
      isModalVisible: false,
      goalText: '',
    };

    // get initial value from props
    getWaterCount().then((data) => {
      // would be null if there is no entry from today
      if (data != null) {
        this.setState({
          barHeight: data,
        });
        this._checkGoalReached(this.state.barHeight, this.state.goalHeight);
      }
    });

    // get initial value from props
    getWaterGoal().then((data) => {
      // would be null if there is no entry from today
      if (data == null) {
        updateWaterGoal(this.state.goalHeight / 100);
      } else {
        this.setState({
          goalHeight: data * 100,
        });
        this._checkGoalReached(this.state.barHeight, this.state.goalHeight);
      }
    });
  }

  _checkGoalReached = (barHeight, goalHeight) => {
    if (barHeight * 100 >= goalHeight) {
      this.setState({
        goalReached: true,
      });
    } else {
      this.setState({
        goalReached: false,
      });
    }
  };

  _onPress = () => {
    LayoutAnimation.spring();

    let barHeight = this.state.barHeight;
    if (barHeight < MAX_BAR_HEIGHT) {
      barHeight = barHeight + 0.1;
      this.setState({
        barHeight: barHeight,
      });
      barHeight = parseFloat(barHeight.toFixed(1));
      // update this in the db too
      updateWaterCount(barHeight);

      // update the counter when it equals the value
      // (instead of just checking if it's over) so we don't double count
      if (barHeight === 0.1) {
        updateCounterTotal();
      }
      if (barHeight === 1.0) {
        updateCounterOne();
      }
      if (barHeight === 3.0) {
        updateCounterThree();
      }
      if (barHeight === 5.0) {
        updateCounterFive();
      }
    }

    this._checkGoalReached(barHeight, this.state.goalHeight);
  };

  _onPressForModal = () => {
    const input = this.state.goalText;
    const num = parseFloat(input);
    if (
      input !== '' &&
      !Number.isNaN(num) &&
      num > 0 &&
      num <= MAX_BAR_HEIGHT
    ) {
      const goalHeight = this.state.goalText * 100;
      this.setState({
        goalHeight: goalHeight,
      });
      updateWaterGoal(parseFloat(goalHeight / 100));
      this._checkGoalReached(this.state.barHeight, goalHeight);
    }
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      goalText: '',
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
              <View style={styles.rowContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => {
                    this.setState({
                      goalText: value,
                    });
                  }}
                  value={this.state.goalText}
                  maxLength={4}
                  placeholder="e.g., 2.3"
                />
                <Text style={styles.modalText}>L</Text>
              </View>

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
              bottom: BASE_HEIGHT + this.state.goalHeight,
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

          <TouchableOpacity
            onPress={this._onPress}
            style={[styles.button, {marginTop: 30}]}>
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
    width: WIDTH * 0.4,
    marginTop: 10,
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
    marginTop: 20,
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
  rowContainer: {
    flexDirection: 'row',
  },
  input: {
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    width: 70,
    padding: 5,
  },
  modalText: {
    bottom: -5,
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 15,
  },
});
