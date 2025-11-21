# type: recv
if (req.http.host ~ "^observer\." &&
    (req.method == "GET" || req.method == "HEAD") &&
    !req.url ~ "^/uk/checkout" &&
    !req.url ~ "^/uk/thank-you" &&
    !req.url ~ "^/assets/" &&
    !req.url ~ "^/favicon.ico" &&
    !req.url ~ "^/favicon.png" &&
    !req.url ~ "^/oauth/authorize" &&
    !req.url ~ "^/oauth/callback" &&
    !req.url ~ "^/postcode-lookup/"
  ) {
  error 802 "redirect";
}
