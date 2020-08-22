import React from 'react';
import {
  NativeModules,
  Text,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {getTodaysDate, getWaterCount, getCounterData} from './firebase.js';
import {
  BarChart,
  ProgressChart,
  ContributionGraph,
} from 'react-native-chart-kit';
import moment from 'moment';

moment().format();

const WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = WIDTH * 0.9;
const CHART_HEIGHT = 220;
const CONTRIBUTION_DAYS = 105;

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const chartConfig = {
  decimalPlaces: 0,
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  color: (opacity = 1) => `rgba(58, 159, 191, ${opacity})`,
  useShadowColorFromDataset: false,
};

function getDaysAgo(num) {
  let daysAgo = [];
  for (var i = 1; i <= num; i++) {
    daysAgo.push(moment().subtract(i, 'days').format('YYYY-MM-DD ddd'));
  }
  return daysAgo;
}

async function getBarChartData() {
  const data = [];
  const labels = [];
  const daysAgo = getDaysAgo(5);

  for (let i = 0; i < daysAgo.length; i++) {
    const date = daysAgo[i].substr(0, 10);
    const day = daysAgo[i].substr(11);
    await getWaterCount(date).then((count) => {
      // would be null if there is no entry from that day
      if (count === null) {
        count = 0;
      }

      data.push(count);
      labels.push(day);
    });
  }

  return {
    labels: labels,
    datasets: [{data: data}],
  };
}

function showBarChart(barChartData) {
  return (
    <BarChart
      style={styles.chart}
      data={barChartData}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      chartConfig={chartConfig}
      showValuesOnTopOfBars={true}
      withVerticalLables={false}
      fromZero={true}
      withInnerLines={true}
    />
  );
}

async function getContributionGraphData() {
  const data = [];
  const daysAgo = getDaysAgo(CONTRIBUTION_DAYS);

  for (let i = 0; i < daysAgo.length; i++) {
    const date = daysAgo[i].substr(0, 10);
    await getWaterCount(date).then((count) => {
      // would be null if there is no entry from that day
      if (count != null) {
        data.push({
          date: date,
          count: count,
        });
      }
    });
  }

  return data;
}

function showContributionGraph(contributionGraphData, onPressDay) {
  return (
    <ContributionGraph
      values={contributionGraphData}
      endDate={getTodaysDate()}
      numDays={CONTRIBUTION_DAYS}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      chartConfig={chartConfig}
      style={styles.chart}
    />
  );
}

async function getProgressChartData() {
  return await getCounterData().then((data) => {
    const total = data.total;
    const one = data.oneL / total;
    const three = data.threeL / total;
    const five = data.fiveL / total;
    return {
      labels: ['>= 1.0L', '>= 3.0L', '>= 5.0L'],
      data: [one, three, five],
    };
  });
}

function showProgressChart(progressChartData) {
  return (
    <ProgressChart
      data={progressChartData}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      strokeWidth={16}
      radius={32}
      chartConfig={chartConfig}
      hideLegend={false}
    />
  );
}

export default class AllWaterData extends React.Component {
  state = {
    barChartData: {
      labels: [],
      datasets: [{data: []}],
    },
    contributionGraphData: [],
    progressChartData: {
      labels: [],
      data: [],
    },
  };

  componentDidMount() {
    getBarChartData().then((data) => {
      this.setState({
        barChartData: data,
      });
    });

    getContributionGraphData().then((data) => {
      this.setState({
        contributionGraphData: data,
      });
    });

    getProgressChartData().then((data) => {
      this.setState({
        progressChartData: data,
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.title}>My Water Data</Text> */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.subtitle}>Past 5 Days</Text>
            {showBarChart(this.state.barChartData)}
          </View>

          <View style={styles.container}>
            <Text style={styles.subtitle}>Past 3 Months</Text>
            {showContributionGraph(this.state.contributionGraphData)}
          </View>

          <View style={styles.container}>
            <Text style={styles.subtitle}>Past Entries</Text>
            {showProgressChart(this.state.progressChartData)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scrollView: {
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginVertical: 30,
    marginHorizontal: 30,
    fontSize: 40,
  },
  subtitle: {
    textAlign: 'center',
    marginLeft: 30,
    marginVertical: 10,
    fontSize: 15,
    zIndex: 999,
    fontWeight: 'bold',
  },
  chart: {
    alignItems: 'center',
  },
});
