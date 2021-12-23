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
        res.cookie(key,id, {maxAge: 9000000000, httpOnly: true});
        res.json({ cookie: key + "=" + id });
      } else {
        throw "Login failed :(";
      }
    }
  );
});

router.get("/search", function (req, res) {
  var key = "JSESSIONID";
  var id = req.cookies["JSESSIONID"];
  console.log(id);

  // Make the request return the search results, passing the header information including the cookie.
  client.get(
    `http://my.octavianlab.com/jira/rest/api/2/${req.query.type}/${req.query.id}`,
    {
      headers: {
        cookie: key + "=" + 'EF62BD85691A13B63CEF413047E4EFC3',
        "Content-Type": "application/json",
      },
      data: {
        // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
        jql: "type=Bug AND status=Closed",
      },
    },
    function (searchResult, response) {
      console.log("status code:", response.statusCode);
      console.log("search result:", searchResult);
      res.json(searchResult);
    }
  );
});

module.exports = router;
