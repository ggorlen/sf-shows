# sf-shows

Script for finding out which musicians I like are playing in the SF area soon.

Currently scraping:

- [foopee's The List](http://www.foopee.com/punk/the-list/)
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
- Add UI/website
- Add weekly GH action
- Sites to scrape:
  - https://noontimeconcerts.org/
  - C4NM
  - Gray Area
  - Back Room (berkeley)
  - https://noontimeconcerts.org/
  - https://dothebay.com/
- Add striations, rubber o, key west, jacob felix, nuclear death wish and other local bands
- Use https://www.npmjs.com/package/fastest-levenshtein
- Trim out bands I don't really care about seeing or who are defunct
