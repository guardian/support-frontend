# type: recv
if (req.http.host ~ "^observer\." &&
    (req.method == "GET" || req.method == "HEAD") &&
    !req.url ~ "^/uk/checkout" &&
    !req.url ~ "^/uk/thank-you" &&
    !req.url ~ "^/assets/" &&
    !req.url ~ "^/favicon.ico" &&
    !req.url ~ "^/support-workers/status"
  ) {
  error 802 "redirect";
}
