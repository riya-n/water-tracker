import database from '@react-native-firebase/database';

const reference = database();

/**
 * Adds a user to the database.
 * @param {String} email The account's email.
 * @param {String} name The user's name.
 */
export async function addAccountToDb(email, name) {
  // TODO(issue/1): implement this after using firebase auth
}

/**
 * Returns the id of the current user.
 * @return {String} The id of the current user.
 */
export function getCurrentUserId() {
  // TODO(issue/1): add user accounts
  // Better to use userId generated from auth here
  return 'riyan@seas';
}

/**
 * Updates (or adds it if it doesn't already exist) the water data of the current day.
 * @param {float} count The amount of water the user has recorded (in liters).
 */
export function updateWaterCount(count) {
  const userId = getCurrentUserId();
  const date = getTodaysDate();
  reference
    .ref(`/${userId}/waterData/${date}`)
    .update({
      count,
    })
    .then(() => console.log(`Data updated to ${count}`));
}

/**
 * Updates (or adds it if it doesn't already exist) the water goal of the current day.
 * @param {float} goal The newly set goal (in liters).
 */
export function updateWaterGoal(goal) {
  const userId = getCurrentUserId();
  const date = getTodaysDate();
  reference
    .ref(`/${userId}/waterData/${date}`)
    .update({
      goal,
    })
    .then(() => console.log(`Data updated to ${goal}`));
}

/**
 * Gets the water data of the current day.
 * @param {String} date The date of the entry to get. Defaulted to today's date.
 * @return {float} The amount of water the user has already had.
 */
export async function getWaterCount(date = getTodaysDate()) {
  const userId = getCurrentUserId();
  return await reference
    .ref(`/${userId}/waterData/${date}/count`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Gets the water goal of the current day.
 * @param {String} date The date of the entry to get. Defaulted to today's date.
 * @return {float} The amount of water the user has already had.
 */
export async function getWaterGoal(date = getTodaysDate()) {
  const userId = getCurrentUserId();
  return await reference
    .ref(`/${userId}/waterData/${date}/goal`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Gets the counters data for the current user.
 * @return {Object} The counter data.
 */
export async function getCounterData() {
  const userId = getCurrentUserId();
  const oneL = await reference
    .ref(`/${userId}/counters/oneL`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  const threeL = await reference
    .ref(`/${userId}/counters/threeL`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  const fiveL = await reference
    .ref(`/${userId}/counters/fiveL`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
  const total = await reference
    .ref(`/${userId}/counters/total`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });

  return {
    oneL: oneL,
    threeL: threeL,
    fiveL: fiveL,
    total: total,
  };
}

/**
 * Increments the counter value for the one liter counter.
 */
export async function updateCounterOne() {
  const userId = getCurrentUserId();
  await reference
    .ref(`/${userId}/counters/oneL`)
    .once('value')
    .then((snapshot) => {
      reference
        .ref(`/${userId}/counters`)
        .update({
          oneL: snapshot.val() + 1,
        })
        .then(() => console.log('Data counter oneL'));
    });
}

/**
 * Increments the counter value for the three liter counter.
 */
export async function updateCounterThree() {
  const userId = getCurrentUserId();
  await reference
    .ref(`/${userId}/counters/threeL`)
    .once('value')
    .then((snapshot) => {
      reference
        .ref(`/${userId}/counters`)
        .update({
          threeL: snapshot.val() + 1,
        })
        .then(() => console.log('Data counter threeL'));
    });
}

/**
 * Increments the counter value for the five liter counter.
 */
export async function updateCounterFive() {
  const userId = getCurrentUserId();
  await reference
    .ref(`/${userId}/counters/fiveL`)
    .once('value')
    .then((snapshot) => {
      reference
        .ref(`/${userId}/counters`)
        .update({
          fiveL: snapshot.val() + 1,
        })
        .then(() => console.log('Data counter fiveL'));
    });
}

/**
 * Increments the counter value for the total counter.
 */
export async function updateCounterTotal() {
  const userId = getCurrentUserId();
  await reference
    .ref(`/${userId}/counters/total`)
    .once('value')
    .then((snapshot) => {
      reference
        .ref(`/${userId}/counters`)
        .update({
          total: snapshot.val() + 1,
        })
        .then(() => console.log('Data counter total'));
    });
}

/**
 * Returns today's date in yyyy-mm-dd format
 */
export function getTodaysDate() {
  const date = new Date();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${date.getFullYear()}-${month}-${day}`;
}
