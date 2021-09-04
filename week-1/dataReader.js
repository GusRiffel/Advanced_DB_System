const fs = require('fs');
const http = require("http");
const server = http.createServer();
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "wineTasting";
const client = new MongoClient(url, { UserNewUrlParser: true});

server.on("request", async (req, res) => {
  const { url, headers } = req;
  try {
      
    const tastes = JSON.parse(fs.readFileSync('wine.json', 'utf-8'));

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("tastes");
    await collection.insertMany(tastes);
    res.end("resquest finished");
  } catch (e) {
    console.log(e);
    res.end("could not update");
  }
});

server.listen(8080);