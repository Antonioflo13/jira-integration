const express = require("express");
const router = express.Router();
var Client = require("node-rest-client").Client;
client = new Client();

router.post("/login", function (req, res) {
  var loginArgs = {
    headers: {
      Authorization: "Basic YS5mbG9yZTpNaW1tYTEzMDE5Mg==",
      "Content-Type": "application/json",
    },
  };
  client.post(
    "http://my.octavianlab.com/jira/rest/auth/1/session",
    loginArgs,
    function (data, response) {
      if (response.statusCode == 200) {
        var key = response.rawHeaders[23].substring(0, 10);
        var id = response.rawHeaders[23].substring(11, 43);
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
      //add Basic Auth username e api token
      Authorization: "Basic YS5mbG9yZTpNaW1tYTEzMDE5Mg==",
      "Content-Type": "application/json",
    },
    data: {
      fields: {
        project: {
          key: "VUE",
        },
        summary: "TEST TICKETING",
        issuetype: {
          id: "10102",
        },
        creator: {
          name: "a.flore",
        },
        assignee: "a.flore",
        priority: "Miglioramento",
        description: "Test",
        reporter: {
          key: "a.flore",
          name: "a.flore",
        },
      },
    },
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

router.get("/search", function (req, res) {
  var key = "JSESSIONID";
  var id = req.cookies["JSESSIONID"];
  var searchArgs = {
    headers: {
      cookie: key + "=" + id,
      "Content-Type": "application/json",
    },
    parameters: {
      // jql: req.query.jql,
      maxResults: req.query.maxResults,
    },
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
  var key = "JSESSIONID";
  var id = req.cookies["JSESSIONID"];
  console.log(id);

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
