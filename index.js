const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const Levenshtein = require("levenshtein");
require("util").inspect.defaultOptions.depth = null;

const escapeRegexp = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

const regexify = (s) =>
  new RegExp(
    escapeRegexp(s)
      .replace(/\w+/g, (m) => `\\b${m}\\b`)
      .replace(/ +/g, "\\s+"),
  );

const scrapeSFCM = async (favArtists) => {
  const url = "https://sfcm.edu/performance-calendar";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const titles = [];
  $(".mar-b-half h3").each(function (i, e) {
    titles.push($(this).text().trim().toLowerCase());
  });

  const allMatches = [];

  for (const artist of favArtists) {
    const matches = titles.filter((e) => regexify(artist).test(e));

    if (matches.length) {
      allMatches.push({ artist, matches });
    }
  }

  return allMatches;
};

const scrapeBayImproviser = async (favArtists, ignore) => {
  const url = "https://www.bayimproviser.com/calendar.aspx";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const descriptions = [];
  $(".description").each(function (i, e) {
    descriptions.push($(this).text().trim().toLowerCase());
  });

  const allMatches = [];

  for (const artist of favArtists) {
    const matches = descriptions.filter((e) => regexify(artist).test(e));

    if (matches.length) {
      allMatches.push({ artist, matches });
    }
  }

  return allMatches;
};

const scrapeTheList = async (favArtists, ignore) => {
  const url = "http://www.foopee.com/punk/the-list/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const artists = [];
  $('a[href^="by-band"]').each(function (i, e) {
    const artist = $(this).text().trim().toLowerCase();

    if (artist) {
      artists.push({ artist, href: url + $(this).attr("href") });
    }
  });

  const allMatches = [];

  for (const a of favArtists) {
    const current = { artist: a, matches: [] };

    for (const { artist: b, href } of artists) {
      if (a.length > 5 && b.length > 5 && (b.includes(a) || a.includes(b))) {
        current.matches.push({ artist: b, href });
      } else {
        const { distance } = new Levenshtein(a, b);

        if (distance < 2) {
          current.matches.push({ artist: b, href });
        }
      }
    }

    if (current.matches.length) {
      allMatches.push(current);
    }
  }

  return allMatches;
};

(async () => {
  const ignore = new Set(
    (await fs.promises.readFile("ignore.txt", "utf-8")).split(/\r?\n/),
  );
  const favArtists = (await fs.promises.readFile("artists.txt", "utf-8"))
    .split(/\r?\n/)
    .map((e) => e.replace(/^the +/, "").trim())
    .filter((e) => e && !ignore.has(e));

  const json = (s) => JSON.stringify(s, null, 2);

  console.log("The List:");
  console.log(json(await scrapeTheList(favArtists)));
  console.log("\nBay Improviser:");
  console.log(json(await scrapeBayImproviser(favArtists)));
  console.log("\nSFCM:");
  console.log(json(await scrapeSFCM(favArtists)));
})().catch((err) => console.error(err));
