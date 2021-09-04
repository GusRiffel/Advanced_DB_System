
const http = require("http");
const server = http.createServer();
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "wineTasting";
const client = new MongoClient(url, { useNewUrlParser: true });

server.on("request", async (req, res) => {
  const { url, headers } = req;


   let getLastPath = url.substring(url.lastIndexOf('/country?italy')+1);
   let getBeforeLastPath = url.split('/')[1];

    try {
  
  
        await client.connect(function(err, db) {
          if (err) throw err;
          var dbo = db.db(dbName);
          dbo.collection("tastes").find({[getBeforeLastPath]:getLastPath}).toArray(function(err, result) {
              if (err) throw err;
              //console.log(result);
              res.end(JSON.stringify(result));
              //db.close();
          });
        });
      
      
      } catch (e) {
        console.log(e);
        res.end("could not update");
      }

});

server.listen(8080);