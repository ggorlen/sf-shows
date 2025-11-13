# sf-shows

Script for finding out which musicians I like are playing in the SF area soon. My picks go [here](https://docs.google.com/document/d/1Q8H7kvvy82kApoI8KO1DR3IpXtKTQGLLifCmS2sunfA/edit?tab=t.0).

Currently scraping:

- [foopee The List](http://www.foopee.com/punk/the-list/)
- [Bay Improviser](https://www.bayimproviser.com/calendar.aspx)
- [SFCM](https://sfcm.edu/performance-calendar)

Usage: `node index`

### Creating the artists.txt list

Extract a list of artists I've listened to:

```
bash download_artists_list.sh
```

### TODOs

- For The List, fetch venue, date and price for any hits
- Use https://www.npmjs.com/package/fastest-levenshtein
- Avoid false positives on Bay Improviser
- Make an API
- Download the list every week or month to archive it and make it searchable
  - already done here: https://jon.luini.com/thelist/
- Add weekly GH action
- Add UI/website
- Sites to scrape:
  - https://19hz.info/
  - https://noontimeconcerts.org/
  - https://thrillhouserecords.com/pages/calendar
  - C4NM
  - https://upthecreekrecords.com/Events (already in the list)
  - Gray Area (actually seems already included)
  - Back Room (berkeley)
  - https://dothebay.com/
  - https://undergroundsf.com/events/
- The list-related sites:
  - https://jon.luini.com/thelist/
  - https://linktr.ee/bayareametalshows
- Add rubber o, key west, commode minstrels, and other local bands
