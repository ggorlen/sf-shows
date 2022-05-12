const cheerio = require("cheerio");
const axios = require("axios");
// also scrape bayimproviser
// TODO compare against list of artists in mp3 drectory or discogs lists

const url = "http://www.foopee.com/punk/the-list/";
(async () => {
  const {data} = await axios.get(url);
  const $ = cheerio.load(data);
  const sel = 'a[href^="by-band"]';
  $(sel).each(function (i, e) {
    //const row = [];
    console.log($(this).text().trim());
  });
})();
