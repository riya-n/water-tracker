const {MongoClient} = require('mongodb');

const url =
  'mongodb+srv://riyan:chocolava@watertrackerdata.1m8p6.mongodb.net/WaterTrackerData?retryWrites=true&w=majority';
const client = new MongoClient(url);

// The database to use
const dbName = 'accounts';

// TODO(issue/1): add user accounts
export const dummyEmail = 'riyan@seas.upenn.edu';

/**
 * Adds a user to the database.
 * @param {String} email The account's email.
 * @param {String} name The user's name.
 */
export async function addAccountToDb(email, name) {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use this collection
    const col = db.collection(email);

    // Construct a document
    const accountInformation = {
      name: name,
      waterData: [],
    };

    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(accountInformation);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

/**
 * Updates (or adds it if it doesn't already exist) the water data of the current day.
 * @param {String} email The email of the current user.
 * @param {String} date The date of the entry to be updated.
 * @param {float} waterCount The amount of water the user has recorded (in liters).
 */
export async function updateWaterData(email, date, waterCount) {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use this collection
    const col = db.collection(email);

    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log('doc', myDoc);

    const found = await col.findOne({'waterData.date': {$gt: date}});

    console.log('found', found);

    if (found === null) {
      // add new water data element
      col.updateOne(
        {_id: myDoc._id},
        {
          $push: {
            waterData: {
              date: date,
              waterCount: waterCount,
            },
          },
        },
      );
    } else {
      // update existing
      col.updateOne(
        {_id: myDoc._id, 'waterData.date': date},
        {$set: {'waterData.$.waterCount': waterCount}},
      );
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

/**
 * Gets the water data of the current day. Returns 0 otherwise.
 * @param {String} email The email of the current user.
 * @param {String} date The date of the entry to be updated.
 * @return {float} The amount of water the user has already had.
 */
export async function getWaterData(email, date) {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use this collection
    const col = db.collection(email);

    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log('doc', myDoc);

    const found = await col.findOne({'waterData.date': {$gt: date}});

    console.log('found', found);

    if (found === null) {
      return 0;
    } else {
      const allWaterData = found['waterData'];
      allWaterData.forEach((waterData) => {
        if (waterData.date === date) {
          return waterData.waterCount;
        }
      });
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
