# type: recv
if (req.http.host ~ "^observer\\." && !req.url ~ "^/uk/checkout") {
  error 802 "redirect";
}
