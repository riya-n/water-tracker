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
      console.log('snaoshot', snapshot);
      return snapshot.val();
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
  return `${date.getFullYear()}-${month}-${date.getDate()}`;
}
