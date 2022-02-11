const serverless = require('serverless-http');

const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jira = require("./jira");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use("/", jira);

const server = http.createServer(app);
const port = 3000;
server.listen(port);
module.exports.handler = serverless(app);
