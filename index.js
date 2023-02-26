const express = require("express");
const port = process.env.PORT || 3000;
const app = new express();
app.use(express.json());
var Twit = require("twit");
var config = require("./config");
var T = new Twit(config);
const cron = require("node-cron");
const axios = require("axios");
let numberOfAyah = 14;
let urlAyah = `https://api.alquran.cloud/v1/ayah/${numberOfAyah}/ar.asad`;

function postToTwitter(text) {
  T.post("statuses/update", { status: text }, (err, resp) => {});
}
cron.schedule("0 0 */3 * * *", () => {
  ++numberOfAyah;
  urlAyah = `https://api.alquran.cloud/v1/ayah/${numberOfAyah}/ar.asad`;
  axios.get(urlAyah).then((response) => {
    if (response.data.data.text.length > 279) {
      return;
    }
    postToTwitter(response.data.data.text);
  });
});

app.listen(() => {}, port);
