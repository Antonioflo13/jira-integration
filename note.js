const username = "a.flore";
const password = "Mimma130192";
const base64Auth =
  "Basic " + Buffer.from(username + ":" + password).toString("base64");

router.post("/login", function (req, res) {
  let loginArgs = {
    headers: {
      Authorization: "Basic YWRtaW46SmIwc3NiM3Q=",
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
let key = "JSESSIONID";
let id = req.cookies["JSESSIONID"];
