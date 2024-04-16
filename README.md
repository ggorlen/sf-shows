# sf-shows

Script for finding out which musicians I like are playing in the SF area soon.

Currently scraping:

- [foopee's The List](http://www.foopee.com/punk/the-list/)
- [Bay Improviser](https://www.bayimproviser.com/calendar.aspx)
- [SFCM](https://sfcm.edu/performance-calendar)

### Creating the artists.txt list

Extract a list of stuff I've listened to:

```
curl https://api.discogs.com/lists/633552
```

Process the exported list (needs improvement):

```
jq -r '[[.items | .[] | .display_title | tostring | split(" - ") | first | ascii_downcase | gsub("\\(\\d+\\)"; "") | gsub("\\*"; "") | gsub("^ +| +$";"")] | unique  | .[] | split(" / "; "") | add] | unique | .[]' < listened.json
```

### TODOs

- For The List, fetch venue, date and price for any hits
- Add UI/website
- Add weekly GH action
- Scrape C4NM, Gray Area, other venues not on the list. Also make sure local artists like striations get into the artists list, either by listening to them on discogs or adding them with a script.
