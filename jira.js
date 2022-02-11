const express = require("express");
const router = express.Router();
const FormData = require("form-data");
const axios = require("axios");

// insert here your domain 
const jiraUrl = "";

// insert here name project
const project = "";

// insert here username
const username = "";
// insert here psw
const password = "";

const base64Auth =
  "Basic " + Buffer.from(username + ":" + password).toString("base64");
const headers = {
  Authorization: base64Auth,
  "Content-Type": "application/json",
};

router.post("/login", function (req, res) {
  axios
    .post(
      "http://insertYourDomain/jira/rest/auth/1/session",
      {},
      {
        headers,
      }
    )
    .then((response) => {
      console.log("status code: login", response.status);
      let tokenKey = response.headers["set-cookie"][1]
        .split(";")[0]
        .split("=")[0];
      let tokenId = response.headers["set-cookie"][1]
        .split(";")[0]
        .split("=")[1];
      let jdSessionkey = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[0];
      let jdSessionId = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .cookie(tokenKey, tokenId, { maxAge: 9000000000, httpOnly: true })
        .cookie(jdSessionkey, jdSessionId, {
          maxAge: 9000000000,
          httpOnly: true,
        })
        .json({
          token: tokenKey + "=" + tokenId,
          jdSession: jdSessionkey + "=" + jdSessionId,
        });
    })
    .catch((error) => {
      console.log("status code: login", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});
router.post("/addTicket", function (req, res) {
  axios
    .post(jiraUrl + "/rest/api/2/issue", req.body.params.data, {
      headers,
    })
    .then((response) => {
      console.log("status code: addTicket", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: addTicket", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.post("/addAttachments", function (req, res) {
  const filesRecievedFromClient = req.body.params.files;
  const formData = new FormData();
  for (const file of filesRecievedFromClient) {
    let buffer = Buffer.from(file.data.split(",")[1], "base64");
    formData.append("file", buffer, file.name);
  }
  const headers = {
    Authorization: base64Auth,
    "X-Atlassian-Token": "nocheck",
    "Content-Type": "multipart/form-data; boundary=" + formData["_boundary"],
  };
  axios
    .post(
      jiraUrl + `/rest/api/2/issue/${req.body.params.issueKey}/attachments`,
      formData,
      {
        headers,
      }
    )
    .then((response) => {
      console.log("status code: addAttachments", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: addAttachments", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/search", function (req, res) {
  axios
    .get(jiraUrl + `/rest/api/2/search`, {
      headers,
      params: req.query,
    })
    .then((response) => {
      console.log("status code: search", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: search", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/downloadAttachment", function (req, res) {
  const attachmentLink = req.query.link;
  axios
    .get(attachmentLink, {
      headers,
      responseType: "arraybuffer",
    })
    .then((response) => {
      console.log("status code: downloadAttachment", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: downloadAttachment", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/searchComponents", function (req, res) {
  axios
    .get(jiraUrl + `/rest/api/2/project/${project}/components`, {
      headers,
    })
    .then((response) => {
      console.log("status code: searchComponents", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: searchComponents", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/searchIssueTypes", function (req, res) {
  axios
    .get(jiraUrl + `/rest/api/2/project/${project}`, {
      headers,
    })
    .then((response) => {
      console.log("status code: searchIssueTypes", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: searchIssueTypes", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/searchPriority", function (req, res) {
  axios
    .get(jiraUrl + `/rest/api/2/priority`, {
      headers,
    })
    .then((response) => {
      console.log("status code: searchPriority", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: searchPriority", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/searchStatuses", function (req, res) {
  axios
    .get(jiraUrl + `/rest/api/2/project/${project}/statuses`, {
      headers,
    })
    .then((response) => {
      console.log("status code: searchStatuses", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: searchStatuses", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.get("/searchItem", (req, res) => {
  axios
    .get(
      jiraUrl + `/rest/api/2/issue/${req.query.id}?expand=names,renderedFields`,
      {
        headers,
      }
    )
    .then((response) => {
      console.log("status code: searchItem", response.status);
      let i = 0;
      for (const el of response.data.renderedFields.comment.comments) {
        response.data.fields.comment.comments[i].bodyHtml = el.body;
        i++;
      }
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: searchItem", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.post("/addComment", function (req, res) {
  axios
    .post(
      jiraUrl + `/rest/api/2/issue/${req.body.params.issueKey}/comment`,
      req.body.params.data,
      {
        headers,
      }
    )
    .then((response) => {
      console.log("status code: addComment", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: addComment", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

router.post("/changeTicketStatus", function (req, res) {
  axios
    .post(
      jiraUrl + `/rest/api/2/issue/${req.body.params.issueKey}/transitions`,
      req.body.params.data,
      {
        headers,
      }
    )
    .then((response) => {
      console.log("status code: changeTicketStatus", response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(response.status)
        .json(response.data);
    })
    .catch((error) => {
      console.log("status code: changeTicketStatus", error.response.status);
      res
        .header("Access-Control-Allow-Origin", "*")
        .status(error.response.status)
        .json(error.response.data);
    });
});

module.exports = router;
