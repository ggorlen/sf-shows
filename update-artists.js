const fs = require("fs/promises");

const LIST_ID = 633552;
const API_URL = `https://api.discogs.com/lists/${LIST_ID}`;

function normalizeArtist(name) {
  name = name.trim();

  const lower = name.toLowerCase();

  if (lower.startsWith("caroliner rainbow")) {
    return "caroliner rainbow";
  }

  if (lower === "work/death") {
    return "work/death";
  }

  if (/^s[\s\-·\/&,|]+core$/i.test(name)) {
    return "s·core";
  }

  return name;
}

function getArtists(title) {
  let artistPart = String(title ?? "").split(" - ")[0];

  artistPart = artistPart
    .replace(/\(\d+\)/g, "")
    .replace(/\*/g, "")
    .replace(/[:\-\[\]]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Protect artist names containing characters that are normally
  // used as artist separators.
  const protectedNames = [];

  function protect(name) {
    const id = protectedNames.length;
    protectedNames.push(normalizeArtist(name));
    return `PROTECTEDARTIST${id}ENDPROTECTEDARTIST`;
  }

  // Work/Death
  artistPart = artistPart.replace(
    /\bwork\/death\b/gi,
    match => protect(match)
  );

  // S-Core variants:
  // S-Core, S·Core, S/Core, S&Core, S|Core
  artistPart = artistPart.replace(
    /\bs[\s·\/&,|]+core\b/gi,
    match => protect(match)
  );

  // Split normal artist separators.
  // + is included here.
  const artists = artistPart
    .split(/\s*[\/&,|·+]\s*/)
    .map(artist => artist.trim())
    .filter(Boolean)
    .map(artist => {
      // Restore protected names even if they ended up adjacent
      // to other text.
      const match = artist.match(
        /^PROTECTEDARTIST(\d+)ENDPROTECTEDARTIST$/
      );

      if (match) {
        return protectedNames[Number(match[1])];
      }

      return normalizeArtist(artist);
    })
    .filter(Boolean);

  return artists;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function main() {
  console.log(`Fetching ${API_URL}...`);

  const response = await fetch(API_URL, {
    headers: {
      "User-Agent": "process-listened/1.0",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Discogs API error: ${response.status} ${response.statusText}\n` +
      body.slice(0, 500)
    );
  }

  const data = await response.json();

  console.log(
    `Fetched ${data.items?.length ?? 0} items.`
  );

  const artists = new Set();

  for (const item of data.items ?? []) {
    for (const artist of getArtists(item.display_title)) {
      artists.add(artist.toLowerCase());
    }
  }

  const sortedArtists = [...artists].sort();

  await fs.writeFile(
    "artists.txt",
    sortedArtists.join("\n") + "\n"
  );
  console.log(
    `Wrote ${sortedArtists.length} artists to artists.txt`
  );

  const listened = (data.items ?? []).map(item => ({
    title: item.display_title,
    uri: item.uri,
    comment: item.comment,
  }));

  await fs.writeFile(
    "listened.json",
    JSON.stringify(listened)
  );
  console.log("Wrote listened.json");

  const html = createHtml(listened);
  await fs.writeFile("index.html", html);
  console.log("Wrote index.html");
}

function createHtml(items) {
  const reversedItems = [...items].reverse();
  const artistCounts = new Map();

  for (const item of items) {
    for (const artist of getArtists(item.title)) {
      artistCounts.set(
        artist,
        (artistCounts.get(artist) || 0) + 1
      );
    }
  }

  const artistEntries = [...artistCounts.entries()];

  artistEntries.sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }

    return a[0].localeCompare(b[0]);
  });

  const artistHtml = artistEntries
    .map(([artist, count]) =>
      `<button class="artist" type="button" data-artist="${escapeHtml(artist)}">${escapeHtml(artist)} <small>${count}</small></button>`
    )
    .join(" ");

  const releaseHtml = reversedItems
    .map(item => {
      const title = escapeHtml(item.title);
      const comment = escapeHtml(item.comment);
      const uri = escapeHtml(item.uri);

      const searchText = escapeHtml(
        String(item.title ?? "").toLowerCase()
      );

      return `<li class="release" data-search="${searchText}"><a href="${uri}" target="_blank" rel="noopener noreferrer">${title}</a>${comment ? ` <span class="comment">— ${comment}</span>` : ""}</li>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Listened</title>
<style>
:root { color-scheme: light dark; }

body {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui,sans-serif;
  line-height: 1.35;
}

h1 {
  margin: 0;
  font-size: 1.4rem;
}

header {
  margin-bottom: .8rem;
}

.meta {
  font-size: .8rem;
  opacity: .65;
}

input {
  width: 100%;
  padding: .4rem .5rem;
  margin: .5rem 0;
  font: inherit;
}

summary {
  cursor: pointer;
  margin: .3rem 0 .5rem;
}

.artist-controls {
  display: flex;
  gap: .5rem;
  align-items: center;
  margin-bottom: .4rem;
  font-size: .8rem;
}

.artist-controls button {
  padding: .15rem .4rem;
  font: inherit;
}

#artists {
  display: flex;
  flex-wrap: wrap;
  gap: .15rem .4rem;
  margin-bottom: .8rem;
}

.artist {
  border: 0;
  padding: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
  opacity: .75;
}

.artist:hover {
  opacity: 1;
}

.artist small {
  opacity: .6;
  font-size: .75em;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.release {
  padding: .22rem 0;
}

.release a {
  color: inherit;
}

.comment {
  opacity: .55;
  font-size: .85em;
}

.hidden {
  display: none;
}
</style>
</head>

<body>
<header>
<h1>Listened</h1>
<div class="meta"><span id="count">${items.length}</span> releases · ${artistEntries.length} artists</div>
<input id="filter" type="search" placeholder="Filter releases..." autocomplete="off" autofocus>

<details>
<summary>Artists</summary>
<div class="artist-controls">
<span>Sort:</span>
<button id="sort-count" type="button">count</button>
<button id="sort-alpha" type="button">A–Z</button>
</div>
<div id="artists">${artistHtml}</div>
</details>
</header>

<ul id="releases">
${releaseHtml}
</ul>

<script>
const filter=document.getElementById("filter");
const releases=[...document.querySelectorAll(".release")];
const count=document.getElementById("count");
const artistsContainer=document.getElementById("artists");
const sortCount=document.getElementById("sort-count");
const sortAlpha=document.getElementById("sort-alpha");

function applyFilter(value){
  const query=value.trim().toLowerCase();
  let visible=0;

  for(const release of releases){
    const matches=!query||release.dataset.search.includes(query);
    release.classList.toggle("hidden",!matches);

    if(matches) visible++;
  }

  count.textContent=visible;
}

filter.addEventListener("input",()=>{
  applyFilter(filter.value);
});

function sortArtists(mode){
  const buttons=[...artistsContainer.querySelectorAll(".artist")];

  buttons.sort((a,b)=>{
    const nameA=a.dataset.artist;
    const nameB=b.dataset.artist;

    if(mode==="alpha"){
      return nameA.localeCompare(nameB);
    }

    const countA=Number(
      a.querySelector("small").textContent
    );

    const countB=Number(
      b.querySelector("small").textContent
    );

    if(countB!==countA){
      return countB-countA;
    }

    return nameA.localeCompare(nameB);
  });

  artistsContainer.replaceChildren(...buttons);
}

sortCount.addEventListener("click",()=>{
  sortArtists("count");
});

sortAlpha.addEventListener("click",()=>{
  sortArtists("alpha");
});

artistsContainer.addEventListener("click",event=>{
  const button=event.target.closest(".artist");

  if(!button){
    return;
  }

  filter.value=button.dataset.artist;
  applyFilter(filter.value);
  filter.focus();
});
</script>
</body>
</html>
`;
}

main();
