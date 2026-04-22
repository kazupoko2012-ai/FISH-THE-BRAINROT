const express = require("express");
const app = express();

app.use(express.json());

let sessions = {};
let requests = {};

app.post("/start", (req, res) => {
  const { ssid, sessionId } = req.body;
  sessions[ssid] = sessionId;
  res.send({ status: "ok" });
});

app.post("/request", (req, res) => {
  const { admin, target } = req.body;

  const token = Math.random().toString(36).substring(2, 12);

  requests[target] = {
    token,
    expires: Date.now() + 60000
  };

  res.send({ status: "sent" });
});

app.get("/check", (req, res) => {
  const { ssid } = req.query;

  if (requests[ssid]) {
    res.send(requests[ssid]);
  } else {
    res.send({});
  }
});

app.post("/approve", (req, res) => {
  const { ssid, sessionId, token } = req.body;

  const reqData = requests[ssid];

  if (
    reqData &&
    reqData.token === token &&
    reqData.expires > Date.now() &&
    sessions[ssid] === sessionId
  ) {
    delete requests[ssid];
    res.send({ status: "approved" });
  } else {
    res.send({ status: "failed" });
  }
});

app.listen(3000, () => console.log("Server running"));
