# type: recv
if (req.http.host ~ "^observer\\." && !req.url ~ "^/uk/checkout" && !req.url ~ "^/thankyou") {
  error 802 "redirect";
}
