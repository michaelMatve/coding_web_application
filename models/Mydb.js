// database.js
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const connectToDatabase = async (mongoURI) => {
  try {
    const client = await MongoClient.connect(mongoURI);
    return client.db();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

const getItemList = async () => {
  try {
    const db = await connectToDatabase('mongodb://localhost:27017/newdb');
    const codesCollection = db.collection('codes');
    const itemList = await codesCollection.find().toArray();
    return itemList;
  } catch (error) {
    console.error('Error retrieving codes:', error);
    throw error;
  }
};

const getCodeById = async (itemId) => {
  try {
    const db = await connectToDatabase('mongodb://localhost:27017/newdb');
    const codesCollection = db.collection('codes');
    const objectId = new ObjectId(itemId);
    const code = await codesCollection.findOne({ _id: objectId });
    console.log(code);
    return code;
  } catch (error) {
    console.error('Error retrieving code by ID:', error);
    throw error;
  }
};

module.exports = { connectToDatabase, getItemList, getCodeById };
