# type: recv
if (req.url ~ "^/books$") {
  set req.url = "/contribute?acquisitionData=%7B%22componentType%22%3A%22ACQUISITIONS_OTHER%22%2C%22source%22%3A%22DIRECT%22%2C%22campaignCode%22%3A%22podcast_books%22%2C%22componentId%22%3A%22podcast_books%22%7D&INTCMP=podcast_books";
}
