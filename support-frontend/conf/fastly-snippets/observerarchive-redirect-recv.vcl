# type: recv
if (req.http.host == "observer.theguardian.com" && !req.url ~ "^/uk/checkout") {
  error 802 "redirect";
}
