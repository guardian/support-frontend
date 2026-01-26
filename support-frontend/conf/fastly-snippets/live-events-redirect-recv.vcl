# type: recv
if (req.url ~ "^/events/archive" ||
    req.url ~ "^/masterclasses" ||
    req.url ~ "^/event/\w+") {
  error 621 "redirect";
}
