# type: recv
if (req.http.host == "observer.theguardian.com"){
  error 802 "redirect";
}
