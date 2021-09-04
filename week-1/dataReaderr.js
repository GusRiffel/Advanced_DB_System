const MongoClient = require("mongodb").MongoClient;
const fs = require('fs').promises;

const url = "mongodb://localhost:27017";
const dbName = "wineTasting";
const collectionName = "tastesy";
const fileName = "wine.json";
const client = new MongoClient(url, { UserNewUrlParser: true});


async function main() {
  try {
    const start = Date.now();
    await client.connect();
    console.log("connected to database server");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const wineTastingData = await fs.readFile(fileName, "utf-8");
    await collection.insertMany(JSON.parse(wineTastingData));
    const count = await collection.find().count();

    console.log(`There are ${count} records this took ${(Date.now() - start) / 1000} seconds to execute`)


    process.exit();
  } catch (error) {
    console.log(error);
  }
}
main();