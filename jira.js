const express = require("express");
const router = express.Router();
const Client = require("node-rest-client").Client;
const FormData = require("form-data");
var multer = require("multer")();
const fs = require("fs");
client = new Client();

const username = "a.flore";
const password = "Mimma130192";
const base64Auth =
  "Basic " + Buffer.from(username + ":" + password).toString("base64");

router.post("/login", function (req, res) {
  let loginArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
  };
  client.post(
    "http://my.octavianlab.com/jira/rest/auth/1/session",
    loginArgs,
    function (data, response) {
      if (response.statusCode == 200) {
        let key = response.rawHeaders[23].substring(0, 10);
        let id = response.rawHeaders[23].substring(11, 43);
        res.cookie("JSESSIONID", id, { maxAge: 9000000000, httpOnly: true });
        res.json({ cookie: key + "=" + id });
      } else {
        throw "Login failed :(";
      }
    }
  );
});

router.post("/addTicket", function (req, res) {
  const bodyData = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
    data: req.body.data,
  };
  client.post(
    "https://my.octavianlab.com/jira/rest/api/2/issue",
    bodyData,
    function (data, response) {
      console.log(response.statusCode);
      if (response.statusCode == 200) {
        res.json(data);
      } else {
        res.json(data);
      }
    }
  );
});

router.post("/addAttachments", multer.single("file"), function (req, res) {
  console.log(req.query);
  console.log(req.file);
  console.log(req.body);
  // const fileRecievedFromClient = req.file;
  // const formData = new FormData();
  // formData.append(
  //   "file",
  //   fileRecievedFromClient.buffer,
  //   fileRecievedFromClient.originalname
  // );
  // console.log(formData);
  const filePath = "/Users/antonioflore/Downloads/aP8u1lC.png";
  const formData = new FormData();
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileStream = fs.createReadStream(filePath);
  formData.append("file", fileStream, { knownLength: fileSizeInBytes });
  const bodyData = {
    headers: {
      Authorization: base64Auth,
      "X-Atlassian-Token": "nocheck",
      "Content-Type": "multipart/form-data; boundary=" + formData["_boundary"],
    },
    data: formData,
  };
  client.post(
    `https://my.octavianlab.com/jira/rest/api/2/issue/VUE-328/attachments`,
    bodyData,
    function (data, response) {
      console.log(response.statusCode);
      if (response.statusCode == 200) {
        res.json(data);
      } else {
        res.json(data);
      }
    }
  );
});

router.get("/search", function (req, res) {
  let key = "JSESSIONID";
  let id = req.cookies["JSESSIONID"];
  let searchArgs = {
    headers: {
      cookie: key + "=" + id,
      "Content-Type": "application/json",
    },
    parameters: req.query,
  };
  // Make the request return the search results, passing the header information including the cookie.
  client.get(
    `http://my.octavianlab.com/jira/rest/api/2/search`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.get("/searchItem", (req, res) => {
  let key = "JSESSIONID";
  let id = req.cookies["JSESSIONID"];

  // Make the request return the search results, passing the header information including the cookie.
  client.get(
    `http://my.octavianlab.com/jira/rest/api/2/${req.query.type}/${req.query.id}`,
    {
      headers: {
        cookie: key + "=" + id,
        "Content-Type": "application/json",
      },
    },
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

module.exports = router;
