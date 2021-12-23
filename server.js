const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jiraLogin = require("./jira");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:8080" }));
app.use("/login", jiraLogin);

app.use("/", function (req, res) {
  res.send("node works :-)");
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);

console.debug("Server listening on port " + port);