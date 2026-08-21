# sf-shows

[![Run Scraper](https://img.shields.io/badge/Run-Scraper-blue?style=for-the-badge)](https://github.com/ggorlen/sf-shows/actions/workflows/run-scraper.yml)
[![Update Artists](https://img.shields.io/badge/Update-Artists-green?style=for-the-badge)](https://github.com/ggorlen/sf-shows/actions/workflows/update-artists.yml)

Script for finding out which musicians I like are playing in the SF area soon. My picks go [here](https://docs.google.com/document/d/1Q8H7kvvy82kApoI8KO1DR3IpXtKTQGLLifCmS2sunfA/edit?tab=t.0).

Currently scraping:

- [foopee The List](http://www.foopee.com/punk/the-list/)
- [Bay Improviser](https://www.bayimproviser.com/calendar.aspx)
- [SFCM](https://sfcm.edu/performance-calendar)
- [Bay Area Metal Shows](https://linktr.ee/bayareametalshows)

Usage: `node index`

## Creating artists.txt, listened.json and index.html

`node update-artists`

## TODOs

- For The List, fetch venue, full list of acts, date and price for any hits
- Use https://www.npmjs.com/package/fastest-levenshtein
- Avoid false positives on Bay Improviser
- Make an API
- Download The List every week or month to archive it and make it searchable
  - already done here: https://jon.luini.com/thelist/
- Sites to scrape:
  - https://19hz.info/
  - https://www.sfems.org/calendar-of-early-music
  - https://kfjc.org/events/concert-outlook
  - https://www.kalx.berkeley.edu/event/events-november-10-16-2025/
  - https://noontimeconcerts.org/
  - https://therehearsalstudio.blogspot.com/2025/11/the-bleeding-edge-11102025.html
  - https://thrillhouserecords.com/pages/calendar
  - [C4NM](https://centerfornewmusic.com/event/)
  - https://upthecreekrecords.com/Events (already in the list)
  - Gray Area (actually seems already included)
  - Back Room (berkeley)
  - https://www.sfems.org/
  - https://www.berkeleyfestival.org/
  - https://dothebay.com/
  - https://undergroundsf.com/events/
  - https://www.instagram.com/prettygritty_sf/
  - https://www.calbach.org/tickets
  - https://www.tactus-sf.org/
  - https://www.coyotemedia.org/tag/calendar/
  - https://medicinefornightmares.com/
  - https://ccrma.stanford.edu/calendar
- The list-related sites:
  - https://www.stevelist.com/
  - https://jon.luini.com/thelist/
  - https://github.com/RP2/bay-punks
- Add key west, and other local bands that may not be derived from discogs
