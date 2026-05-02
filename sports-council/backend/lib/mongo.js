const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'sports-council';
let client;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

async function getDb() {
  const mongoClient = await getClient();
  return mongoClient.db(dbName);
}

function normalizeDoc(doc) {
  if (!doc) return null;
  const normalized = { ...doc, id: doc.id || (doc._id ? doc._id.toString() : undefined) };
  delete normalized._id;
  return normalized;
}

function normalizeArray(items) {
  return items.map(normalizeDoc);
}

module.exports = {
  getDb,
  normalizeDoc,
  normalizeArray,
};
