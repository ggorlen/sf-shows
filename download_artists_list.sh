#!/usr/bin/env bash
set -euo pipefail

curl https://api.discogs.com/lists/633552 -o listened.json
jq -r '
  .items[]
  | .display_title
  | tostring
  | split(" - ")
  | .[0]
  | ascii_downcase
  | gsub("\\(\\d+\\)"; "")
  | gsub("\\*"; "")
  | gsub("[:\\-\\[\\]]+"; " ")
  | gsub("\\s+"; " ")
  | gsub("^\\s+|\\s+$"; "")
  | split("\\s*[/&,|·]\\s*"; "")
  | .[]
  | gsub("^\\s+|\\s+$"; "")
' listened.json | sort -u > artists.txt

