# sf-shows

Script for finding out which musicians I like are playing in the SF area soon. My picks go [here](https://docs.google.com/document/d/1Q8H7kvvy82kApoI8KO1DR3IpXtKTQGLLifCmS2sunfA/edit?tab=t.0).

Currently scraping:

- [foopee The List](http://www.foopee.com/punk/the-list/)
- [Bay Improviser](https://www.bayimproviser.com/calendar.aspx)
- [SFCM](https://sfcm.edu/performance-calendar)

### Creating the artists.txt list

Extract a list of stuff I've listened to:

```
curl https://api.discogs.com/lists/633552 -o listened.json
```

Process the exported list (needs improvement):

```
jq -r '[[.items | .[] | .display_title | tostring | split(" - ") | first | ascii_downcase | gsub("\\(\\d+\\)"; "") | gsub("\\*"; "") | gsub("^ +| +$";"")] | unique  | .[] | split(" / "; "") | add] | unique | .[]' < listened.json > artists.txt
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
  - https://noontimeconcerts.org/
  - https://thrillhouserecords.com/pages/calendar
  - C4NM
  - Gray Area (actually seems already included)
  - Back Room (berkeley)
  - https://dothebay.com/
- The list-related sites:
  - https://jon.luini.com/thelist/
  - https://linktr.ee/bayareametalshows
- Add striations, rubber o, key west, commode minstrels, and other local bands
