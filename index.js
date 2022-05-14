const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const Levenshtein = require("levenshtein");
require("util").inspect.defaultOptions.depth = null;

// also scrape bayimproviser
// TODO compare against list of artists in discogs lists
// TODO fetch venue and price for matches

const url = "http://www.foopee.com/punk/the-list/";

(async () => {
  const favArtists = (await fs.promises.readFile("artists.txt"))
    .toString()
    .split(/\r?\n/)
    .map(e => e.replace(/^the +/, "").trim())
    .filter(e => e)
  ;
  const {data} = await axios.get(url);
  const $ = cheerio.load(data);
  const sel = 'a[href^="by-band"]';
  const artists = [];
  $(sel).each(function (i, e) {
    const artist = $(this).text().trim().toLowerCase();

    if (artist) {
      //console.log(url + $(this).attr("href"));
      artists.push(artist);
    }
  });

  const allMatches = [];

  for (const a of favArtists) {
    const current = {artist: a, matches: []};

    for (const b of artists) {
      if (a.length > 5 && b.length > 5 && (b.includes(a) || a.includes(b))) {
        current.matches.push({artist: b});
      }
      else {
        const {distance} = new Levenshtein(a, b);
        
        if (distance < 2) {
          current.matches.push({artist: b, distance});
        }
      }
    }

    if (current.matches.length) {
      allMatches.push(current);
    }
  }

  console.log(JSON.stringify(allMatches, null, 2));
})()
  .catch(err => console.error(err))
;
