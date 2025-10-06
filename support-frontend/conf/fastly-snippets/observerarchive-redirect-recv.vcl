# type: recv
if (req.http.host ~ "^observer\." && !req.url ~ "^/uk/checkout" && !req.url ~ "^/uk/thank-you") {
  error 802 "redirect";
}
