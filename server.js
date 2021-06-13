const http = require("http");
const fs = require("fs");

const pool = [];
function pushIntoPoll(req, res) {
  pool.push(res);
}

function notify(message) {
  for (let res of pool) res.end(message);
  pool.length = 0;
}

function handleMessage(req, res) {
  let message = "";
  req.on("data", (chunk) => {
    message += chunk;
  });
  req.on("end", () => {
    emitMessage(message);
    res.end();
  });
}

http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    if (method === "GET") {
        if (url === "/poll") pushIntoPoll(req, res);
        else fs.createReadStream(__dirname + "/client.html").pipe(res);
    } else if (method === "POST" && url === "/message") notify(req, res);
    else res.end("");
  })
  .listen(5000)
  .on("listening", () => {
    console.log("Listening on port 5000");
  });