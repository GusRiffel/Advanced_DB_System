const http = require("http");
const server = http.createServer();

server.on("request", (req, res) => {
  const { method, url, headers } = req;

  console.log(method);
  console.log(url);
  console.log(headers);

  res.end("hello World");
});

server.listen(8080);