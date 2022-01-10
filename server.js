const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jiraLogin = require("./jira");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:8080", credentials: true }));

app.use("/", jiraLogin);

const server = http.createServer(app);
const port = 3000;
server.listen(port);

console.debug("Server listening on port " + port);
