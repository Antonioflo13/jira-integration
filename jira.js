const express = require("express");
const router = express.Router();
const Client = require("node-rest-client").Client;
const FormData = require("form-data");
const multer = require("multer")();
const fs = require("fs");
client = new Client();

const jiraUrl = "https://my.octavianlab.com/jira";
const base64Auth = "Basic YWRtaW46SmIwc3NiM3Q=";
const project = 'HD';

router.post("/addTicket", function (req, res) {
  const bodyData = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
    data: req.body.data,
  };
  client.post(
    jiraUrl + "/rest/api/2/issue",
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
    jiraUrl + `/rest/api/2/issue/VUE-328/attachments`,
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
  console.log(req.query);
  let searchArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
    parameters: req.query
  };
  client.get(
    jiraUrl + `/rest/api/2/search`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.get("/searchComponents", function (req, res) {
  let searchArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
  };
  client.get(
    jiraUrl + `/rest/api/2/project/${project}/components`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.get("/searchIssueTypes", function (req, res) {
  let searchArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
  };
  client.get(
    jiraUrl + `/rest/api/2/project/${project}`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.get("/searchPriority", function (req, res) {
  let searchArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
  };
  client.get(
    jiraUrl + `/rest/api/2/priority`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.get("/searchStatuses", function (req, res) {
  let searchArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
  };
  client.get(
    jiraUrl + `/rest/api/2/project/${project}/statuses`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.get("/searchItem", (req, res) => {

  client.get(
    jiraUrl + `/rest/api/2/${req.query.type}/${req.query.id}`,
    {
      headers: {
        Authorization: base64Auth,
        "Content-Type": "application/json",
      },
    },
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

router.post("/addComment", function (req, res) {
  console.log(req.body);
  let searchArgs = {
    headers: {
      Authorization: base64Auth,
      "Content-Type": "application/json",
    },
    data: req.body.data,
  };
  client.post(
    jiraUrl + `/rest/api/2/issue/${req.body.params.issueKey}/comment`,
    searchArgs,
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      res.json(searchResult);
    }
  );
});

module.exports = router;
