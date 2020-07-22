const {MongoClient} = require('mongodb');

const url =
  'mongodb+srv://riyan:chocolava@watertrackerdata.1m8p6.mongodb.net/WaterTrackerData?retryWrites=true&w=majority';
const client = new MongoClient(url);

// The database to use
const dbName = 'accounts';

// TODO(issue/1): add user accounts
const dummyEmail = 'riyan@seas.upenn.edu';

// /**
//  * Adds a user to the database.
//  * @param {String} email The account's email.
//  * @param {String} name The user's name.
//  */
// export async function addAccountToDb(email, name) {
//   try {
//     await client.connect();
//     console.log('Connected correctly to server');
//     const db = client.db(dbName);

//     // Use this collection
//     const col = db.collection(email);

//     // Construct a document
//     const accountInformation = {
//       name: name,
//       waterData: [],
//     };

//     // Insert a single document, wait for promise so we can read it back
//     const p = await col.insertOne(accountInformation);
//   } catch (err) {
//     console.log(err.stack);
//   } finally {
//     await client.close();
//   }
// }

// /**
//  * Updates (or adds it if it doesn't already exist) the water data of the current day.
//  * @param {String} email The email of the current user.
//  * @param {String} date The date of the entry to be updated.
//  * @param {float} waterCount The amount of water the user has recorded (in liters).
//  */
// export async function updateWaterData(email, date, waterCount) {
//   try {
//     await client.connect();
//     console.log('Connected correctly to server');
//     const db = client.db(dbName);

//     // Use this collection
//     const col = db.collection(email);

//     // Find one document
//     const myDoc = await col.findOne();
//     // Print to the console
//     console.log('doc', myDoc);

//     // update in the water data array
//     col.updateOne(
//       {
//         _id: myDoc._id,
//         waterData.date
//       },
//       {
//         $push: {
//           waterData: {
//             date: date,
//             waterCount: waterCount, // in liters
//           },
//         },
//       },
//       {
//         upsert: true,
//       },
//     );
//   } catch (err) {
//     console.log(err.stack);
//   } finally {
//     await client.close();
//   }
// }

async function run() {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use this collection
    const col = db.collection(dummyEmail);

    // Construct a document
    const accountInformation = {
      name: 'Riya Narayan',
      waterData: [
        {
          date: '2020-07-23',
          waterCounter: 4.3, // in liters
        },
        {
          date: '2020-07-22',
          waterCounter: 2.0, // in liters
        },
      ],
    };

    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(accountInformation);
    console.log('promise', p);
    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log('doc', myDoc);

    // add more water data
    col.updateOne(
      {_id: myDoc._id},
      {
        $push: {
          waterData: {
            date: '2020-07-21',
            waterCounter: 2.7, // in liters
          },
        },
      },
    );

    // update today's counter
    col.updateOne(
      {_id: myDoc._id, 'waterData.date': '2020-07-22'},
      {$set: {'waterData.$.waterCounter': 2.3}},
    );

    // check if it exists
    // const found = await col.find({'waterData.date': '2020-07-22'});
    const found = await col.findOne( { 'waterData.date': { $gt: '2020-07-22' } } );

    console.log('found', found);

    // update one that doesn't exist
    // col.updateOne(
    //   {_id: myDoc._id, 'waterData.date': '2020-07-25'},
    //   {$set: {'waterData.$.waterCounter': 1.7}},
    //   {upsert: true},
    // );
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
